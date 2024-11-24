import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AssignmentFormProps {
    selectedStudents: number[]
    onClose: () => void
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({ selectedStudents, onClose }) => {
    const [selectedTutor, setSelectedTutor] = useState('')

    const handleAssignment = () => {
        if (selectedTutor && selectedStudents.length > 0) {
            // Aquí iría la lógica para asignar los estudiantes al tutor
            console.log(`Asignando estudiantes ${selectedStudents.join(', ')} al tutor ${selectedTutor}`)
            // Llamada a la API para guardar las asignaciones
            onClose()
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="tutor-select" className="text-sm font-medium">Tutor</label>
                <Select value={selectedTutor} onValueChange={setSelectedTutor}>
                    <SelectTrigger id="tutor-select">
                        <SelectValue placeholder="Seleccionar tutor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Luis Fernández</SelectItem>
                        <SelectItem value="2">José Ramírez</SelectItem>
                        {/* Más tutores... */}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAssignment} className="w-full" disabled={!selectedTutor || selectedStudents.length === 0}>
                Asignar Estudiantes
            </Button>
        </div>
    )
}

