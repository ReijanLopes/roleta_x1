"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/sortable-item";
import { EditDialog } from "@/components/edit-dialog";
import { Button } from "@/components/ui/button";
import { CloudAlert, CloudCheck, CloudUpload, Plus } from "lucide-react";

import type { Prize } from "@/type";
import { toast } from "sonner";
import { debounce } from "@/lib/utils";

function normalizeIndexes(arr: Prize[]): Prize[] {
  return arr
    .sort((a, b) => a.index - b.index)
}

export default function ListDashboard() {
  const [prize, setPrizes] = useState<Prize[]>([]);
  const [editingItem, setEditingItem] = useState<Prize | null>(null);
  const [createdItem, setCreatedItem] = useState<Prize | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"syncing" | "success" | "error">(
    "success"
  );
  const [loading, setLoading] = useState(true);
  const [defaultError, setDefaultError] = useState(false);

  const fetchPrizes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roll", { method: "POST" });

      if (!res.ok) throw new Error("no prizes endpoint");

      const data: {
        pool: Prize[];
      } = await res.json();

      if (Array.isArray(data.pool) && data.pool.length > 0) {
        setPrizes(normalizeIndexes(data.pool));
      } else {
        setDefaultError(true);
      }
    } catch (error) {
      setDefaultError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

const updateIndexesOnServer = useMemo(() => debounce(async (normalized: Prize[]) => {
  try {
    const res = await fetch("/api/roll/reorder", {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify({
        items: normalized.map((i) => ({
          id: i.id,
          index: i.index,
        })),
      }),
    });

    const result = await res.json();
    if (!res.ok || result.error) {
      
      setSyncStatus("error");
      toast.error(result.error || "Erro ao atualizar ordem.");
      return;
    }

    setSyncStatus("success");
  } catch (err) {
    console.log("Fetch",err)
    toast.error("Erro ao atualizar ordem.");
    setSyncStatus("error");
  }
}, 1500), [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSyncStatus("syncing");
      setPrizes((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(prev, oldIndex, newIndex);

        const normalized = newItems.map((item, idx) => ({
          ...item,
          index: idx + 1,
        }));

        // 🔥 Dispara atualização no backend
        updateIndexesOnServer(normalized);

        return normalized;
      });
    }
  };

  const handleEdit = (item: Prize) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = async (updatedItem: Prize) => {
    setLoading(true);
    const formData = new FormData();
    if (updatedItem.id) formData.append("id", updatedItem.id);
    formData.append("name", updatedItem.name);
    formData.append("description", updatedItem.description);
    formData.append("imageUrl", updatedItem.imageUrl);
    formData.append("isGood", String(updatedItem.isGood));
    formData.append("index", String(updatedItem.index));
    formData.append("color", updatedItem.color);

    try {
      const res = await fetch("/api/roll/mutate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        toast.error(
          updatedItem.id
            ? "Erro ao atualizar o premio."
            : "Erro ao criar o premio."
        );
      }

      const { data, error, message } = await res.json();
      if (error) {
        toast.error(
          updatedItem.id
            ? "Erro ao atualizar o premio."
            : "Erro ao criar o premio."
        );
        return;
      }

      updatedItem.id
        ? setPrizes((items) =>
            items.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            )
          )
        : setPrizes(normalizeIndexes([...prize, data]));

      setIsDialogOpen(false);
      setEditingItem(null);
      setCreatedItem(null);

      toast.success(
        updatedItem.id
          ? "Premio atualizado com sucesso!"
          : "Premio criado com sucesso!"
      );
      return;
    } catch (error) {
      toast.error(
        updatedItem.id
          ? "Erro ao atualizar o premio."
          : "Erro ao criar o premio."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/roll/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        toast.error(result.error || "Erro ao deletar o prêmio.");
        return;
      }

      setPrizes(result.data); // atualiza o estado local
      toast.success(result.message);

    } catch (error) {
      toast.error("Erro ao deletar o prêmio.");

      console.error(error);
    }
  };

  const handleAdd = () => {
    setCreatedItem({
      id: "",
      name: "",
      description: "",
      imageUrl: "",
      color: "",
      isGood: true,
      index: prize?.length + 1 || 1,
    });
    setIsDialogOpen(true);
  };

  const openDialog = createdItem || editingItem;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Gerenciador de Premios
            </h1>
            <div>
              <div className="flex items-center gap-4">
                <p className="text-muted-foreground">
                  Arraste para reordenar e clique para editar
                </p>
                {syncStatus === "syncing" && (
                  <CloudUpload className="text-yellow-500" />
                )}
                {syncStatus === "success" && (
                  <CloudCheck className="text-green-500" />
                )}
                {syncStatus === "error" && (
                  <CloudAlert className="text-red-500" />
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={handleAdd}
            size="lg"
            className="gap-2 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600"
          >
            <Plus className="w-5 h-5" />
            <p className="">Adicionar</p>
            
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={prize?.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {prize?.map((item, idx) => (
                <SortableItem
                  key={item.id || idx}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {openDialog && (
          <EditDialog
            item={openDialog}
            open={isDialogOpen}
            loading={loading}
            onOpenChange={(e) => {
              setIsDialogOpen(e);
              setEditingItem(null);
              setCreatedItem(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </main>
  );
}
