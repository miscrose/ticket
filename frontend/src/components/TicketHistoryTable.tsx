import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { CommentModal } from "../kanban/components/commentModal";

const statusOptions = [
  { value: "", label: "Tous" },
  { value: "todo", label: "À faire" },
  { value: "in-progress", label: "En cours" },
  { value: "done", label: "Terminé" },
];

export default function TicketHistoryTable() {
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<{ id: string; title: string } | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [perPage] = useState(7);

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      const firstPageRes = await axios.get("http://127.0.0.1:8000/api/show_tickets_paginated", {
        params: {
          page: 1,
          per_page: 1000,
          search: "",
          status: ""
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        }
      });

      setAllTickets(firstPageRes.data.tickets);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return allTickets.filter(ticket => {
      const matchesSearch = searchTerm === "" || 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === "" || ticket.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allTickets, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredTickets.length / perPage);
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredTickets.slice(startIndex, endIndex);
  }, [filteredTickets, currentPage, perPage]);

  const pagination = useMemo(() => {
    const total = filteredTickets.length;
    const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);
    
    return {
      total,
      from,
      to,
      current_page: currentPage,
      last_page: totalPages,
      per_page: perPage
    };
  }, [filteredTickets.length, currentPage, totalPages, perPage]);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket({ id: ticket.id, title: ticket.title });
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    setSelectedTicket(null);
  };

  const handleExportPdf = async (ticketId: number | string) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/tickets/${ticketId}/export-pdf`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: 'application/pdf'
        }
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg">Chargement des tickets...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-slate-800 mb-1">Historique des Tickets</h1>
              <p className="text-slate-600 text-sm">Gérez et suivez tous vos tickets en un seul endroit</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 rounded-full px-3 py-1">
                <span className="text-blue-700 font-semibold text-sm">
                  {pagination ? `${pagination.from}-${pagination.to} sur ${pagination.total}` : '0'} tickets
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input
                type="text"
                placeholder="Rechercher par titre..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 transition-all duration-200 text-sm"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 pr-8 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer text-sm h-9"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {paginatedTickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">Aucun ticket trouvé</h3>
              <p className="text-slate-600 text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <>
              <div className="h-[400px] overflow-hidden">
                <Table className="w-full">
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="font-semibold text-slate-700 py-3 px-4 text-xs uppercase tracking-wide">ID</TableCell>
                      <TableCell className="font-semibold text-slate-700 py-3 px-4 text-xs uppercase tracking-wide">Titre</TableCell>
                      <TableCell className="font-semibold text-slate-700 py-3 px-4 text-xs uppercase tracking-wide">Statut</TableCell>
                      <TableCell className="font-semibold text-slate-700 py-3 px-4 text-xs uppercase tracking-wide">Créé le</TableCell>
                      <TableCell className="font-semibold text-slate-700 py-3 px-4 text-xs uppercase tracking-wide">Modifié le</TableCell>
                      <TableCell className="font-semibold text-slate-700 py-3 px-4 text-xs uppercase tracking-wide">Assigné à</TableCell>
                      <TableCell className="font-semibold text-slate-700 py-3 px-4 text-xs uppercase tracking-wide">Créé par</TableCell>
                      <TableCell className="font-semibold text-slate-700 py-3 px-4 text-xs uppercase tracking-wide">PDF</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTickets.map((ticket) => (
                      <TableRow 
                        key={ticket.id} 
                        className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200 group"
                      >
                        <TableCell className="py-3 px-4">
                          <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                            #{ticket.id}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <button
                            onClick={() => handleTicketClick(ticket)}
                            className="text-left group-hover:text-blue-600 transition-colors duration-200 font-medium text-slate-800 hover:text-blue-600 text-sm"
                          >
                            {ticket.title}
                          </button>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <span
                            className={
                              `inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold transition-all duration-200 ` +
                              (ticket.status === 'done'
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : ticket.status === 'in-progress'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200')
                            }
                          >
                            {statusOptions.find(o => o.value === ticket.status)?.label || ticket.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-slate-600 text-xs">
                          {new Date(ticket.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-slate-600 text-xs">
                          {new Date(ticket.updated_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                            {ticket.user?.name || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 bg-slate-50 text-slate-700 text-xs rounded-lg">
                            {ticket.creator?.name || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <button
                            onClick={() => handleExportPdf(ticket.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-slate-300 rounded-md hover:bg-slate-100"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                            </svg>
                            PDF
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pagination && pagination.last_page > 1 && (
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-600">
                      Affichage de {pagination.from} à {pagination.to} sur {pagination.total} tickets
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-xs border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                      >
                        Précédent
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                          let pageNum;
                          if (pagination.last_page <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= pagination.last_page - 2) {
                            pageNum = pagination.last_page - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1 text-xs border rounded-md transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.last_page}
                        className="px-3 py-1 text-xs border border-slate-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {selectedTicket && (
          <CommentModal
            ticketId={selectedTicket.id}
            ticketTitle={selectedTicket.title}
            isOpen={isCommentModalOpen}
            onClose={closeCommentModal}
          />
        )}
      </div>
    </div>
  );
}