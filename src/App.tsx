import { useState, useEffect } from 'react';
import axios from 'axios';

import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import AcademicDashboard from './components/AcademicDashboard';

// Tipos
interface ConnectionForm {
  user: string;
  password: string;
  server: string;
  database: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
}

interface ItemForm {
  name: string;
  description: string;
}

const API_URL = 'http://localhost:4321';

const App = () => {
  // Estados
  const [connectionForm, setConnectionForm] = useState<ConnectionForm>({
    user: '',
    password: '',
    server: '',
    database: '',
  });
  const [isConnected, setIsConnected] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [itemForm, setItemForm] = useState<ItemForm>({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isConnected) {
      fetchItems();
    }
  }, [isConnected]);

  // Manejadores de formularios
  const handleConnectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnectionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemForm(prev => ({ ...prev, [name]: value }));
  };

  // Funciones API
  const configureDatabase = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/configure`, connectionForm);
      setIsConnected(true);
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

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Item[]>(`${API_URL}/api/items`);
      setItems(response.data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Error al obtener los elementos',
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/items`, itemForm);
      await fetchItems();
      toast({
        title: "Item agregado",
        description: "El item se ha agregado correctamente.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Error al agregar el elemento',
      });
    } finally {
      setLoading(false);
    }
  };

  // Iniciar edición
  const startEdit = (item: Item) => {
    setItemForm({ name: item.name, description: item.description });
    setEditingId(item.id);
  };

  // Cancelar edición
  const cancelEdit = () => {
    setItemForm({ name: '', description: '' });
    setEditingId(null);
  };

  // Actualizar item
  const updateItem = async () => {
    if (!itemForm.name.trim() || !editingId) return;

    setLoading(true);
    setError(null);
    try {
      await axios.put(`${API_URL}/api/items/${editingId}`, itemForm);
      setItemForm({ name: '', description: '' });
      setEditingId(null);
      await fetchItems();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al actualizar el elemento');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;

    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/items/${id}`);
      await fetchItems();
      toast({
        title: "Item eliminado",
        description: "El item se ha eliminado correctamente.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || 'Error al eliminar el elemento',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="p-8 max-w-4xl mx-auto">
    //   {error && (
    //     <Alert variant="destructive" className="mb-4">
    //       <AlertDescription>{error}</AlertDescription>
    //     </Alert>
    //   )}
    //   {/* {!isConnected ? (
    //     <Card className='max-w-xl mx-auto'>
    //       <CardHeader>
    //         <CardTitle>Configurar Conexión a SQL Server</CardTitle>
    //       </CardHeader>
    //       <CardContent className="space-y-4">
    //         {['user', 'password', 'server', 'database'].map((field) => (
    //           <div key={field}>
    //             <Label htmlFor={field} className="capitalize">
    //               {field === 'database' ? 'Base de Datos' : field}
    //             </Label>
    //             <Input
    //               id={field}
    //               name={field}
    //               type={field === 'password' ? 'password' : 'text'}
    //               value={connectionForm[field as keyof ConnectionForm]}
    //               onChange={handleConnectionChange}
    //               disabled={loading}
    //               className="mt-1"
    //             />
    //           </div>
    //         ))}
    //       </CardContent>
    //       <CardFooter>
    //         <Button
    //           className="w-full"
    //           onClick={configureDatabase}
    //           disabled={loading || Object.values(connectionForm).some(v => !v.trim())}
    //         >
    //           {loading ? (
    //             <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...</>
    //           ) : (
    //             'Conectar'
    //           )}
    //         </Button>
    //       </CardFooter>
    //     </Card>
    //   ) : (
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Gestión de Items</CardTitle>
    //       </CardHeader>
    //       <CardContent className="space-y-6">
    //         <div className="flex gap-4">
    //           <div className="flex-1">
    //             <Label htmlFor="name">Nombre</Label>
    //             <Input
    //               id="name"
    //               name="name"
    //               value={itemForm.name}
    //               onChange={handleItemChange}
    //               disabled={loading}
    //               className="mt-1"
    //             />
    //           </div>
    //           <div className="flex-1">
    //             <Label htmlFor="description">Descripción</Label>
    //             <Input
    //               id="description"
    //               name="description"
    //               value={itemForm.description}
    //               onChange={handleItemChange}
    //               disabled={loading}
    //               className="mt-1"
    //             />
    //           </div>
    //           <div className="flex items-end space-x-2">
    //             {editingId ? (
    //               <>
    //                 <Button
    //                   onClick={updateItem}
    //                   disabled={loading || !itemForm.name.trim()}
    //                 >
    //                   Actualizar
    //                 </Button>
    //                 <Button
    //                   variant="secondary"
    //                   onClick={cancelEdit}
    //                   disabled={loading}
    //                 >
    //                   Cancelar
    //                 </Button>
    //               </>
    //             ) : (
    //               <Button
    //                 onClick={addItem}
    //                 disabled={loading || !itemForm.name.trim()}
    //               >
    //                 Agregar
    //               </Button>
    //             )}
    //           </div>
    //         </div>

    //         {loading && <div className="text-center py-4">
    //           <Loader2 className="h-8 w-8 animate-spin mx-auto" />
    //         </div>}

    //         <ul className="space-y-2">
    //           {items.map((item) => (
    //             <li key={item.id} className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50">
    //               <div>
    //                 <h3 className="font-medium">{item.name}</h3>
    //                 {item.description && (
    //                   <p className="text-sm text-gray-600">{item.description}</p>
    //                 )}
    //               </div>
    //               <div className="space-x-2">
    //                 <Button
    //                   variant="secondary"
    //                   onClick={() => startEdit(item)}
    //                   disabled={loading}
    //                 >
    //                   Editar
    //                 </Button>
    //                 <Button
    //                   variant="destructive"
    //                   onClick={() => deleteItem(item.id)}
    //                   disabled={loading}
    //                 >
    //                   Eliminar
    //                 </Button>
    //               </div>
    //             </li>
    //           ))}
    //           {!loading && items.length === 0 && (
    //             <li className="text-center py-8 text-gray-500">
    //               No hay items para mostrar
    //             </li>
    //           )}
    //         </ul>
    //       </CardContent>
    //     </Card>
    //   )} */}
    // </div>
    <AcademicDashboard />

  );
};

export default App;