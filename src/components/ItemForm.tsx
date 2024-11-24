import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ItemFormProps {
    onSubmit: (formData: ItemFormData) => Promise<void>;
    loading: boolean;
    initialData?: ItemFormData;
    isEditing?: boolean;
    onCancel?: () => void;
}

interface ItemFormData {
    name: string;
    description: string;
}

export const ItemForm = ({
    onSubmit,
    loading,
    initialData,
    isEditing,
    onCancel
}: ItemFormProps) => {
    const [formData, setFormData] = useState<ItemFormData>(initialData || {
        name: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        if (!isEditing) {
            setFormData({ name: '', description: '' });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{isEditing ? 'Editar Item' : 'Nuevo Item'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading}
                            className="mt-1"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={loading || !formData.name.trim()}
                        >
                            {isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};