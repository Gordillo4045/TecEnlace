import React, { useState, useEffect } from 'react'
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
import { Search, X, Filter, Loader2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AssignmentForm } from './AssignmentForm'
import { localStorageService } from '@/services/localStorageService'
import { Career, Student } from '@/types'
import { cn } from '@/lib/utils'

interface StudentListProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export const StudentList: React.FC<StudentListProps> = ({ searchQuery, setSearchQuery }) => {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedStudents, setSelectedStudents] = useState<number[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [careers, setCareers] = useState<Career[]>([])
    useEffect(() => {
        fetchStudents()
        fetchCareers()
    }, [])

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const data = await localStorageService.students.getAll()
            setStudents(data)
        } catch (error) {
            console.error('Error fetching students:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCareers = async () => {
        const data = await localStorageService.careers.getAll()
        setCareers(data)
    }

    // Estados para los filtros
    const [selectedCareer, setSelectedCareer] = useState("")
    const [selectedPlan, setSelectedPlan] = useState("")
    const [showFilters, setShowFilters] = useState(false)

    const handleSelectStudent = (studentId: number) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        )
    }

    const handleRemoveStudent = (studentId: number) => {
        setSelectedStudents(prev => prev.filter(id => id !== studentId))
    }

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.no_control.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCareer = !selectedCareer || student.id_carrera?.toString() === selectedCareer;

        const matchesPlan = !selectedPlan || student.paquete_inscrito === selectedPlan;

        return matchesSearch && matchesCareer && matchesPlan;
    });

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
                            <CardTitle>Gestión de Estudiantes</CardTitle>
                            <CardDescription>Lista de estudiantes y sus detalles</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={fetchStudents}
                                disabled={loading}
                            >
                                <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar estudiantes..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {showFilters && (
                        <div className="mb-6 p-4 border rounded-lg space-y-4">
                            <h3 className="font-medium mb-2">Filtros</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Carrera</label>
                                    <Select value={selectedCareer} onValueChange={setSelectedCareer}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar carrera" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {careers.map((career) => (
                                                <SelectItem key={career.id_carrera} value={career.id_carrera.toString()}>
                                                    {career.nombre_carrera}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Plan</label>
                                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">ISIC-2010-224</SelectItem>
                                            <SelectItem value="2">ISIC-2015-230</SelectItem>
                                            {/* Más planes... */}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button variant="secondary" onClick={() => {
                                        setSelectedCareer("")
                                        setSelectedPlan("")
                                    }}>
                                        Limpiar Filtros
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    className="tecnm-button"
                                    onClick={() => setIsDialogOpen(true)}
                                    disabled={selectedStudents.length === 0}
                                >
                                    Asignar a Tutor ({selectedStudents.length})
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Asignar Estudiantes a Tutor</DialogTitle>
                                    <DialogDescription>
                                        Selecciona un tutor para asignar a los estudiantes seleccionados.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <h4 className="mb-4 font-medium">Estudiantes seleccionados:</h4>
                                    <ul className="space-y-2">
                                        {selectedStudents.map(studentId => {
                                            const student = students.find(s => s.id_alumno === studentId)
                                            return (
                                                <li key={studentId} className="flex justify-between items-center">
                                                    <span>{student?.nombre_completo}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveStudent(studentId)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <AssignmentForm
                                    selectedStudents={selectedStudents}
                                    onClose={() => {
                                        setIsDialogOpen(false)
                                        setSelectedStudents([])
                                    }}
                                    onAssignmentComplete={fetchStudents}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Seleccionar</TableHead>
                                <TableHead>No. Control</TableHead>
                                <TableHead>Nombre Completo</TableHead>
                                <TableHead>Carrera</TableHead>
                                <TableHead>Estatus</TableHead>
                                <TableHead>Calificación</TableHead>
                                <TableHead>Nivel Tutoría</TableHead>
                                <TableHead>Semestre</TableHead>
                                <TableHead>Estatus Asignación</TableHead>
                                <TableHead>Tutor Asignado</TableHead>
                                <TableHead>Motivo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id_alumno}>
                                    <TableCell className="flex justify-center">
                                        <Checkbox
                                            checked={selectedStudents.includes(student.id_alumno)}
                                            onCheckedChange={() => handleSelectStudent(student.id_alumno)}
                                        />
                                    </TableCell>
                                    <TableCell>{student.no_control}</TableCell>
                                    <TableCell>{student.nombre_completo}</TableCell>
                                    <TableCell>{student.nombre_carrera}</TableCell>
                                    <TableCell>
                                        <Badge className="tecnm-badge" variant={student.estatus === 'Activo' ? 'default' : 'secondary'}>
                                            {student.estatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{student.calificacion_tutorias}</TableCell>
                                    <TableCell>{student.nivel_tutoria}</TableCell>
                                    <TableCell>{student.semestre_actual}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={student.status_asignacion === 'Asignado' ? 'secondary' : 'destructive'}
                                        >
                                            {student.status_asignacion}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{student.tutor_asignado}</TableCell>
                                    <TableCell>{student.motivo}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )
    )
}

