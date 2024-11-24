import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const StatisticsView: React.FC = () => {
    // Aquí normalmente harías llamadas a la API para obtener los datos de las vistas estadísticas
    const careerStats = [
        { id: 1, nombre_carrera: 'Ingeniería en Sistemas Computacionales', total_alumnos: 150, promedio_calificacion_tutorias: 85.5, total_tutores: 10 },
        // Más estadísticas por carrera...
    ]

    const periodSummary = {
        total_alumnos: 500,
        total_tutores: 30,
        total_entrevistas: 1000,
        total_canalizaciones: 50
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Estadísticas por Carrera</CardTitle>
                    <CardDescription>Resumen de tutorías por carrera</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {careerStats.map((stat) => (
                            <Card key={stat.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{stat.nombre_carrera}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Total Alumnos: {stat.total_alumnos}</p>
                                    <p>Promedio Calificación: {stat.promedio_calificacion_tutorias.toFixed(2)}</p>
                                    <p>Total Tutores: {stat.total_tutores}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Resumen del Período Actual</CardTitle>
                    <CardDescription>Estadísticas generales de tutorías</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap
-4">
                        <div>
                            <h3 className="font-semibold">Total Alumnos</h3>
                            <p className="text-2xl">{periodSummary.total_alumnos}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Total Tutores</h3>
                            <p className="text-2xl">{periodSummary.total_tutores}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Total Entrevistas</h3>
                            <p className="text-2xl">{periodSummary.total_entrevistas}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Total Canalizaciones</h3>
                            <p className="text-2xl">{periodSummary.total_canalizaciones}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

