import { useState, useEffect } from 'react';
import { PeriodStatistics, Statistics } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { apiService } from '@/services/api';

export const StatisticsView: React.FC = () => {
    const [statistics, setStatistics] = useState<Statistics[]>([]);
    const [periodStatistics, setPeriodStatistics] = useState<PeriodStatistics | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const data = await apiService.statistics.getAll();
            setStatistics(data);

            const periodSummary = await apiService.periodsStatistics.getAll();
            setPeriodStatistics(periodSummary);

        } catch (error) {
            console.error('Error detallado:', error);
            setStatistics([]);
            setPeriodStatistics(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Resumen del Período Actual</CardTitle>
                    <CardDescription>Estadísticas generales de tutorías</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : periodStatistics ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <h3 className="font-semibold">Total Alumnos</h3>
                                <p className="text-2xl">{periodStatistics.total_alumnos}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Total Tutores</h3>
                                <p className="text-2xl">{periodStatistics.total_tutores}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Total Entrevistas</h3>
                                <p className="text-2xl">{periodStatistics.total_entrevistas}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Total Canalizaciones</h3>
                                <p className="text-2xl">{periodStatistics.total_canalizaciones}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            No hay estadísticas disponibles para el período actual
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Estadísticas por Carrera</CardTitle>
                    <CardDescription>Resumen de tutorías por carrera</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {statistics.map((stat, index) => (
                                <Card key={index}>
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

