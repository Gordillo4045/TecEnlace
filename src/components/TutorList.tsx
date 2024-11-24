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
import { Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TutorListProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export const TutorList: React.FC<TutorListProps> = ({ searchQuery, setSearchQuery }) => {
    // Aquí normalmente harías una llamada a la API para obtener los datos de la tabla Tutores
    const tutors = [
        { id: 1, nombre_completo: 'Luis Fernández', estatus: 'Activo', num_estudiantes: 15 },
        // Más tutores...
    ]

    return (
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
                            <TableRow key={tutor.id}>
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
}

