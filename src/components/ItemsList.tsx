import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Item {
    id: number;
    name: string;
    description: string;
}

interface ItemsListProps {
    items: Item[];
    onEdit: (item: Item) => void;
    onDelete: (id: number) => void;
    loading: boolean;
}

export const ItemsList = ({ items, onEdit, onDelete, loading }: ItemsListProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lista de Items</CardTitle>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="text-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    </div>
                )}

                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id} className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50">
                            <div>
                                <h3 className="font-medium">{item.name}</h3>
                                {item.description && (
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                )}
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => onEdit(item)}
                                    disabled={loading}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => onDelete(item.id)}
                                    disabled={loading}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </li>
                    ))}
                    {!loading && items.length === 0 && (
                        <li className="text-center py-8 text-gray-500">
                            No hay items para mostrar
                        </li>
                    )}
                </ul>
            </CardContent>
        </Card>
    );
};