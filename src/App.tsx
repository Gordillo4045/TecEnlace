import { useState } from 'react';
import axios from 'axios';

import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import AcademicDashboard from './components/AcademicDashboard';
import DemoAcademicDashboard from './components/demo/AcademicDashboard';
import { initializeDemoData } from './services/demoService';
import { API_URL } from './config';

// Tipos
interface ConnectionForm {
  user: string;
  password: string;
  server: string;
  database: string;
}

const App = () => {
  const [connectionForm, setConnectionForm] = useState<ConnectionForm>(() => {
    const savedConnection = localStorage.getItem('connectionData');
    return savedConnection ? JSON.parse(savedConnection) : {
      user: '',
      password: '',
      server: '',
      database: '',
    };
  });
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem('isConnected') === 'true';
  });
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('isDemoMode') === 'true';
  });

  const { toast } = useToast();

  const handleConnectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnectionForm(prev => ({ ...prev, [name]: value }));
  };

  const configureDatabase = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/configure`, connectionForm);
      setIsConnected(true);
      setIsDemoMode(false);
      localStorage.setItem('isConnected', 'true');
      localStorage.setItem('connectionData', JSON.stringify(connectionForm));
      localStorage.removeItem('isDemoMode');
      toast({
        title: "Conexión exitosa",
        description: "La conexión a la base de datos se ha establecido correctamente.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: error.response?.data?.error || 'Error al conectar con la base de datos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsDemoMode(false);
    localStorage.removeItem('isConnected');
    localStorage.removeItem('connectionData');
    localStorage.removeItem('isDemoMode');
    setConnectionForm({
      user: '',
      password: '',
      server: '',
      database: '',
    });
  };

  const handleDemoMode = () => {
    initializeDemoData();
    setIsConnected(true);
    setIsDemoMode(true);
    localStorage.setItem('isConnected', 'true');
    localStorage.setItem('isDemoMode', 'true');
    toast({
      title: "Modo Demo Activado",
      description: "Los datos de demostración han sido cargados correctamente.",
    });
  };

  return (
    <div className="mx-auto">
      {!isConnected ? (
        <div className="flex justify-center items-center h-screen w-screen">
          <Card className='min-w-[400px] mx-auto'>
            <CardHeader>
              <CardTitle>Configurar Conexión a SQL Server</CardTitle>
            </CardHeader>
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
                    value={connectionForm[field as keyof ConnectionForm]}
                    onChange={handleConnectionChange}
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                onClick={configureDatabase}
                disabled={loading || Object.values(connectionForm).some(v => !v.trim())}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...</>
                ) : (
                  'Conectar'
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDemoMode}
              >
                Ver Modo Demo
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        isDemoMode ? (
          <DemoAcademicDashboard handleDisconnect={handleDisconnect} />
        ) : (
          <AcademicDashboard handleDisconnect={handleDisconnect} />
        )
      )}
    </div>
  );
};

export default App;