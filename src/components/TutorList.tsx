import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tutor } from '@/types';
import { API_URL } from '@/config';

interface TutorListProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export const TutorList: React.FC<TutorListProps> = ({ searchQuery, setSearchQuery }) => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/tutors`);
            setTutors(response.data);
        } catch (error) {
            console.error('Error al obtener tutores:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        loading ? (
            <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        ) : (
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Gestión de Tutores</CardTitle>
                            <CardDescription>Lista de tutores y sus asignaciones</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar tutores..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre Completo</TableHead>
                                <TableHead>Estatus</TableHead>
                                <TableHead>Estudiantes Asignados</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tutors.map((tutor) => (
                                <TableRow key={tutor.id_tutor}>
                                    <TableCell>{tutor.nombre_completo}</TableCell>
                                    <TableCell>{tutor.estatus}</TableCell>
                                    <TableCell>{tutor.num_estudiantes}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm">Ver Detalles</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    )
}

