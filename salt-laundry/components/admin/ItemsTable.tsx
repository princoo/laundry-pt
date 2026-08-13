"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ItemRow } from "@/components/admin/ItemRow";
import type { AdminItem } from "@/lib/hooks/useAdminItems";

interface Props {
  items: AdminItem[];
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (item: AdminItem) => void;
  onReorder: (orderedIds: string[]) => void;
}

// A blank first header sits over the drag-handle column.
const HEADERS = [
  "",
  "Item (EN / FR)",
  "Normal",
  "Dry-cleaning",
  "Pressing",
  "Active",
  "Actions",
];

export function ItemsTable({ items, onToggle, onEdit, onReorder }: Props) {
  // A small activation distance means a plain click on the handle (to focus, or
  // a mis-tap) doesn't start a drag- only an actual movement does. The keyboard
  // sensor makes the list reorderable without a mouse.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex).map((i) => i.id));
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm p-10 text-center text-sm text-salt-text-sec">
        No items in the catalogue yet.
      </div>
    );
  }

  // DndContext wraps the table from the OUTSIDE: it renders hidden accessibility
  // <div>s, which are invalid as direct children of <table>. SortableContext
  // renders no DOM of its own, so it can sit inside the table around <tbody>.
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white rounded-xl border border-[0.5px] border-salt-border shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-salt-cream text-salt-text-muted text-xs uppercase">
              {HEADERS.map((h, i) => (
                <th
                  key={i}
                  className="py-3 px-5 text-left font-medium whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <tbody>
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onToggle={onToggle}
                  onEdit={onEdit}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </div>
    </DndContext>
  );
}
