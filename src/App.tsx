import { useState } from 'react';
import axios from 'axios';

import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import AcademicDashboard from './components/AcademicDashboard';

// Tipos
interface ConnectionForm {
  user: string;
  password: string;
  server: string;
  database: string;
}

const API_URL = 'http://localhost:4321';

const App = () => {
  // Estados
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

  const { toast } = useToast();

  // Manejadores de formularios
  const handleConnectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnectionForm(prev => ({ ...prev, [name]: value }));
  };

  // const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setItemForm(prev => ({ ...prev, [name]: value }));
  // };

  // Funciones API
  const configureDatabase = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/configure`, connectionForm);
      setIsConnected(true);
      localStorage.setItem('isConnected', 'true');
      localStorage.setItem('connectionData', JSON.stringify(connectionForm));
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

  // const fetchItems = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get<Item[]>(`${API_URL}/api/items`);
  //     setItems(response.data);
  //   } catch (error: any) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: error.response?.data?.error || 'Error al obtener los elementos',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const addItem = async () => {
  //   setLoading(true);
  //   try {
  //     await axios.post(`${API_URL}/api/items`, itemForm);
  //     await fetchItems();
  //     toast({
  //       title: "Item agregado",
  //       description: "El item se ha agregado correctamente.",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: error.response?.data?.error || 'Error al agregar el elemento',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Iniciar edición
  // const startEdit = (item: Item) => {
  //   setItemForm({ name: item.name, description: item.description });
  //   setEditingId(item.id);
  // };

  // // Cancelar edición
  // const cancelEdit = () => {
  //   setItemForm({ name: '', description: '' });
  //   setEditingId(null);
  // };

  // // Actualizar item
  // const updateItem = async () => {
  //   if (!itemForm.name.trim() || !editingId) return;

  //   setLoading(true);
  //   setError(null);
  //   try {
  //     await axios.put(`${API_URL}/api/items/${editingId}`, itemForm);
  //     setItemForm({ name: '', description: '' });
  //     setEditingId(null);
  //     await fetchItems();
  //   } catch (error: any) {
  //     setError(error.response?.data?.error || 'Error al actualizar el elemento');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const deleteItem = async (id: number) => {
  //   if (!window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;

  //   setLoading(true);
  //   try {
  //     await axios.delete(`${API_URL}/api/items/${id}`);
  //     await fetchItems();
  //     toast({
  //       title: "Item eliminado",
  //       description: "El item se ha eliminado correctamente.",
  //     });
  //   } catch (error: any) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: error.response?.data?.error || 'Error al eliminar el elemento',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Agregar función para desconectarse
  const handleDisconnect = () => {
    setIsConnected(false);
    localStorage.removeItem('isConnected');
    localStorage.removeItem('connectionData');
    setConnectionForm({
      user: '',
      password: '',
      server: '',
      database: '',
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
            <CardFooter>
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
            </CardFooter>
          </Card>
        </div>
      ) : (
        <AcademicDashboard handleDisconnect={handleDisconnect} />
      )}
    </div>
  );
};

export default App;