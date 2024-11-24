import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ConnectionFormProps {
    onSubmit: (formData: ConnectionFormData) => Promise<void>;
    loading: boolean;
}

interface ConnectionFormData {
    user: string;
    password: string;
    server: string;
    database: string;
}

export const ConnectionForm = ({ onSubmit, loading }: ConnectionFormProps) => {
    const [formData, setFormData] = useState<ConnectionFormData>({
        user: '',
        password: '',
        server: '',
        database: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Configurar Conexión a SQL Server</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {['user', 'password', 'server', 'database'].map((field) => (
                        <div key={field}>
                            <Label htmlFor={field} className="capitalize">
                                {field === 'database' ? 'Base de Datos' : field}
                            </Label>
                            <Input
                                id={field}
                                name={field}
                                type={field === 'password' ? 'password' : 'text'}
                                value={formData[field as keyof ConnectionFormData]}
                                onChange={handleChange}
                                disabled={loading}
                                className="mt-1"
                                required
                            />
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || Object.values(formData).some(v => !v.trim())}
                    >
                        {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...</>
                        ) : (
                            'Conectar'
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};