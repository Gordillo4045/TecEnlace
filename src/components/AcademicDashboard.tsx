import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Users, BookOpen, LogOut } from 'lucide-react'
import { StudentList } from "./StudentList"
import { TutorList } from "./TutorList"
import { StatisticsView } from "./StatisticsView"

export default function AcademicDashboard({ handleDisconnect }: { handleDisconnect: () => void }) {
  const [selectedPeriod, setSelectedPeriod] = React.useState("2141")
  const [searchQuery, setSearchQuery] = React.useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="tecnm-header w-full py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="/LogoTecNM.svg"
              alt="TecNM Logo"
              width={200}
              height={60}
              className="h-12 w-auto"
            />
            <div className="h-8 w-px bg-white/20" />
            <h1 className="text-xl font-bold">Sistema de Tutorías</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2141">Ago-Dic 2024</SelectItem>
                <SelectItem value="2142">Ene-Jun 2025</SelectItem>
              </SelectContent>
            </Select>
            <Button className="tecnm-button">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Cambiar Período
            </Button>
            <Button onClick={handleDisconnect} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Desconectar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="bg-white shadow">
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-[#003366] data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Estudiantes
            </TabsTrigger>
            <TabsTrigger
              value="tutors"
              className="data-[state=active]:bg-[#003366] data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Tutores
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className="data-[state=active]:bg-[#003366] data-[state=active]:text-white"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <StudentList
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </TabsContent>

          <TabsContent value="tutors">
            <TutorList searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

