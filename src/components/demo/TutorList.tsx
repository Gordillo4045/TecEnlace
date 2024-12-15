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
import { Tutor } from '@/types';
import { localStorageService } from '@/services/localStorageService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    const fetchTutors = () => {
        setLoading(true);
        try {
            const tutorsData = localStorageService.tutors.getAll();
            setTutors(tutorsData);
        } catch (error) {
            console.error('Error al obtener tutores:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar tutores basado en la búsqueda
    const filteredTutors = tutors.filter(tutor =>
        tutor.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleExportStudents = async (tutorId: number) => {
        try {
            const students = await localStorageService.students.getAll();
            const tutor = tutors.find(t => t.id_tutor === tutorId);
            const tutorStudents = students.filter(s => s.tutor_asignado === tutor?.nombre_completo);

            const doc = new jsPDF();

            // Encabezado principal
            doc.setFontSize(12);
            doc.text('TECNOLÓGICO NACIONAL DE MÉXICO', 105, 20, { align: 'center' });
            doc.text('Instituto Tecnológico de Tijuana', 105, 30, { align: 'center' });
            doc.text('Reg. Sep. 02DIT0021M', 105, 35, { align: 'center' });

            // Texto del año
            doc.setFontSize(10);
            doc.text(`"${new Date().getFullYear()}, Año del Centenario de la Promulgación de la Constitución Política de los Estados Unidos Mexicanos"`,
                105, 45, { align: 'center' });

            // Información del documento
            doc.text([
                'DEPARTAMENTO:       DEPTO SIST Y COMP',
                'NO. DE OFICIO:           DSC-14073',
                'ASUNTO:                      ASIGNACIÓN DE TUTORADOS',
                'LUGAR Y FECHA:        TIJUANA, B. C.F.A. A ' + new Date().toLocaleDateString()
            ], 100, 60);

            // Destinatario
            doc.text([
                'C. ' + tutor?.nombre_completo,
                'CATEDRÁTICO DE ESTE DEPARTAMENTO,',
                'PRESENTE.'
            ], 20, 90);

            // Texto del cuerpo
            doc.text([
                `Atendiendo lo establecido en el documento Normativo para la Tutoría, SINEST-AC-DN-015, punto 3, 3.1, 3.3.5, 3.3.7 y en los Acuerdos del Comité Promotor de Tutoría que especifican las condiciones de la función tutorial y la facultad que tiene el Jefe del Departamento Académico para asignar tutores a estudiantes y modificar al tutor, me permito comunicarle que ha sido asignado como tutor de los alumnos de la Carrera de ${tutorStudents[0]?.nombre_carrera}, que a continuación se indican:`
            ], 20, 110, { align: 'justify', maxWidth: 170 });

            // Tabla de estudiantes
            autoTable(doc, {
                head: [['CONTROL', 'NOMBRE DEL ALUMNO']],
                body: tutorStudents.map(student => [
                    student.no_control,
                    student.nombre_completo
                ]),
                startY: 140
            });

            // Texto posterior a la tabla
            const finalY = (doc as any).lastAutoTable.finalY + 20;
            doc.text([
                'La atención tutorial se realizará a partir de esta fecha y durante el periodo correspondiente al primer y segundo semestre de la carrera de los alumnos tutorados. Es importante para el seguimiento del Programa Institucional, que se presenten los informes parciales y final de los resultados de los Subprogramas de Acción Tutorial de sus Tutorados, de acuerdo con el calendario de actividades de la institución.',
                '',
                'Considerando que el trabajo que realizamos tiene sentido en cuanto asumimos la responsabilidad social de contribuir a la información integral de nuestros estudiantes, agradezco de antemano su disposición de colaborar.'
            ], 20, finalY, { align: 'justify', maxWidth: 170 });

            // Pie de documento
            doc.text([
                'A T E N T A M E N T E',
                '',
                'ING. GABRIELA LOURDES TAPIA GONZALEZ',
                'JEFE DEL DEPARTAMENTO DE SISTEMAS Y COMPUTACIÓN'
            ], 20, finalY + 60);

            // Pie de página
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(8);
            doc.text([
                'c.c.p. Coordinación Institucional de Tutoría',
                'Archivo.'
            ], 20, pageHeight - 20);

            doc.save(`asignacion_tutorados_${tutor?.nombre_completo}.pdf`);
        } catch (error) {
            console.error('Error al exportar estudiantes:', error);
        }
    }

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
                {loading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
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
                            {filteredTutors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No se encontraron tutores
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTutors.map((tutor) => (
                                    <TableRow key={tutor.id_tutor}>
                                        <TableCell>{tutor.nombre_completo}</TableCell>
                                        <TableCell>{tutor.estatus}</TableCell>
                                        <TableCell>{tutor.num_estudiantes}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleExportStudents(tutor.id_tutor)}
                                            >
                                                Exportar Estudiantes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}

