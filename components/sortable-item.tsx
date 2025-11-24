'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Prize } from '@/type'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface SortableItemProps {
  item: Prize
  onEdit: (item: Prize) => void
  onDelete: (id: string) => void
}

export function SortableItem({ item, onEdit, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50 z-50' : ''}
    >
      <Card className="overflow-hidden border-2 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center gap-4 p-4">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
          </div>

          {/* Index Badge */}
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-md"
            style={{ backgroundColor: item.color }}
          >
            {item.index}
          </div>

          {/* Image */}
          {/* <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div> */}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground font-mono">
                {item.color}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item)}
              className="bg-blue-600 text-white hover:text-white hover:bg-blue-700"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
