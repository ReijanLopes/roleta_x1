"use client";

import { useState, useEffect } from "react";
import type { Prize } from "@/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButtonClient } from "./submit-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface EditDialogProps {
  item: Prize;
  open: boolean;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (item: Prize) => void;
}

export function EditDialog({
  item,
  open,
  loading,
  onOpenChange,
  onSave,
}: EditDialogProps) {
  const [formData, setFormData] = useState<Prize>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias nos campos abaixo
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome do item"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição do item"
                rows={3}
                required
              />
            </div>

            {/* <div className="grid gap-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="/assets/skin.png"
              />
            </div> */}

            <div className="grid gap-2">
              <Label htmlFor="color">Cor</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="#0ea5e9"
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            <Input
              id="index"
              type="number"
              value={formData.index}
              className="hidden"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  index: parseInt(e.target.value) || 1,
                })
              }
              min="1"
            />
          </div>
          <div></div>
          <Select
            value={formData.isGood.toString()}
            onValueChange={(e) => {
              setFormData({
                ...formData,
                isGood: e === "true" ? true : false,
              });
            }}
            
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a qualidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Bom 🤩</SelectItem>
              <SelectItem value="false">Ruim 😭</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <SubmitButtonClient
              className="lg:w-[149px] bg-gradient-to-r from-blue-500 to-purple-600"
              isPending={loading}
            >
              Salvar alterações
            </SubmitButtonClient>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
