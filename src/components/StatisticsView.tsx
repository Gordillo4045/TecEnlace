import { useState, useEffect } from 'react';
import axios from 'axios';
import { Statistics } from '@/types';
import { API_URL } from '@/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export const StatisticsView: React.FC = () => {
    const [statistics, setStatistics] = useState<Statistics[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/statistics`);
            setStatistics(response.data);
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
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

