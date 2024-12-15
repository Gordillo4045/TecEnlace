import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { Tutor } from '@/types';
import { Loader2 } from 'lucide-react';
import { localStorageService } from '@/services/localStorageService';
import { Textarea } from "@/components/ui/textarea";

interface AssignmentFormProps {
    selectedStudents: number[]
    onClose: () => void
    onAssignmentComplete: () => void
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({ selectedStudents, onClose, onAssignmentComplete }) => {
    const [selectedTutor, setSelectedTutor] = useState('')
    const [motivo, setMotivo] = useState('')
    const [loading, setLoading] = useState(false)
    const [tutors, setTutors] = useState<Tutor[]>([])
    const { toast } = useToast()

    useEffect(() => {
        fetchTutors()
    }, [])

    const fetchTutors = () => {
        const data = localStorageService.tutors.getAll();
        setTutors(data);
    }

    const handleAssignment = () => {
        if (selectedTutor && selectedStudents.length > 0) {
            setLoading(true);
            try {
                // Obtener estudiantes actuales
                const students = localStorageService.students.getAll();
                const tutors = localStorageService.tutors.getAll();
                const selectedTutorObj = tutors.find(t => t.id_tutor === parseInt(selectedTutor));

                // Actualizar estudiantes seleccionados
                const updatedStudents = students.map(student => {
                    if (selectedStudents.includes(student.id_alumno)) {
                        return {
                            ...student,
                            tutor_asignado: selectedTutorObj?.nombre_completo || 'Sin asignar',
                            status_asignacion: 'Asignado',
                            motivo: motivo
                        };
                    }
                    return student;
                });

                // Actualizar número de estudiantes del tutor
                const updatedTutors = tutors.map(tutor => {
                    if (tutor.id_tutor === parseInt(selectedTutor)) {
                        return {
                            ...tutor,
                            num_estudiantes: tutor.num_estudiantes + selectedStudents.length
                        };
                    }
                    return tutor;
                });

                // Guardar cambios en localStorage
                localStorage.setItem('students', JSON.stringify(updatedStudents));
                localStorage.setItem('tutors', JSON.stringify(updatedTutors));

                toast({
                    title: "Asignación exitosa",
                    description: "Los estudiantes han sido asignados al tutor correctamente.",
                });

                onAssignmentComplete();
                onClose();
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo completar la asignación.",
                });
                console.error('Error en la asignación:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="space-y-4">
            {loading ? (
                <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <label htmlFor="tutor-select" className="text-sm font-medium">Tutor</label>
                        <Select value={selectedTutor} onValueChange={setSelectedTutor}>
                            <SelectTrigger id="tutor-select">
                                <SelectValue placeholder="Seleccionar tutor" />
                            </SelectTrigger>
                            <SelectContent>
                                {tutors.map((tutor) => (
                                    <SelectItem key={tutor.id_tutor} value={tutor.id_tutor.toString()}>
                                        {tutor.nombre_completo}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="motivo" className="text-sm font-medium">Motivo de asignación</label>
                        <Textarea
                            id="motivo"
                            placeholder="Ingrese el motivo de la asignación..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <Button
                        onClick={handleAssignment}
                        className="w-full"
                        disabled={!selectedTutor || selectedStudents.length === 0 || !motivo.trim()}
                    >
                        Asignar Estudiantes
                    </Button>
                </>
            )}
        </div>
    )
}

