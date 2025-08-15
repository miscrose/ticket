import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent } from "../../components/ui/card";
import { useState, useEffect } from "react";
import { useFileUpload } from "../../hooks/use-file-upload";
import axios from "axios";


interface CommentModalProps {
  ticketId: string;
  ticketTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentModal({ ticketId, ticketTitle, isOpen, onClose }: CommentModalProps) {
  const [comment, setComment] = useState("");
  const [showAddComment, setShowAddComment] = useState(false);


  type Attachment = { id: number; url: string };
  type CommentItem = {
    id: number;
    content: string;
    created_at?: string;
    user?: { id: number; name: string } | null;
    attachments?: Attachment[];
  };

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchComments = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/tickets/${ticketId}/comments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              Accept: 'application/json',
            },
          }
        );
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        setLoadError("Impossible de charger les commentaires");
        console.error('Erreur chargement commentaires:', err?.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [isOpen, ticketId]);

  const resolveUrl = (url: string) => {
    if (!url) return '#';
    return `http://127.0.0.1:8000${url}`;
  };
  const isImage = (url: string) => /\.(png|jpg|jpeg|gif|webp|jfif)$/i.test(url);

  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    accept: ".jpg,.jpeg,.png,.webp,.jfif,.pdf,.doc,.docx",
    maxSize: 2 * 1024 * 1024,
  });

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert("Veuillez saisir un commentaire (obligatoire)");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ticket_id', String(ticketId));
      formData.append('content', comment);

 
      if (files.length > 0) {
        files.forEach((fileObj) => {
          if (fileObj.file && fileObj.file instanceof File) {
            formData.append('attachments[]', fileObj.file);
          }
        });
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/ticket-comments',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          
            Accept: 'application/json',
          },
        }
      );

      console.log("Commentaire créé:", response.data);
      
     
      setComment("");
      clearFiles();
      setShowAddComment(false);
      onClose();
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
      if (error?.response?.data) {
        console.error('Détails serveur:', error.response.data);
        const serverMsg = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
        alert(`Erreur lors de l'envoi du commentaire: ${serverMsg}`);
      } else {
        alert("Erreur lors de l'envoi du commentaire");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Commentaires du ticket {ticketTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
         
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Commentaires</h3>
            <Card>
              <CardContent className="p-4 space-y-3">
                {loading && (
                  <p className="text-sm text-gray-500">Chargement...</p>
                )}
                {loadError && (
                  <p className="text-sm text-red-600">{loadError}</p>
                )}
                {!loading && !loadError && comments.length === 0 && (
                  <p className="text-sm text-gray-500">Aucun commentaire pour le moment</p>
                )}
                {!loading && !loadError && comments.length > 0 && (
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className="border rounded p-3">
                        <div className="text-xs text-gray-600 mb-1 flex items-center justify-between">
                          <span>{c.user?.name ?? 'Utilisateur'}</span>
                          {c.created_at && (
                            <span className="text-gray-400">{new Date(c.created_at).toLocaleString('fr-FR')}</span>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                        {c.attachments && c.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {c.attachments.map((att) => (
                              <div key={att.id} className="border rounded p-1">
                                                                 {isImage(att.url) ? (
                                   <a href={resolveUrl(att.url)} target="_blank" rel="noreferrer">
                                     <img
                                       src={resolveUrl(att.url)}
                                       alt="Pièce jointe"
                                       className="h-20 w-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                     />
                                   </a>
                                ) : (
                                  <a
                                    href={resolveUrl(att.url)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-blue-600 underline"
                                  >
                                    Télécharger la pièce jointe
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bouton pour afficher la zone d'ajout de commentaire */}
          {!showAddComment && (
            <div className="flex justify-end">
              <Button onClick={() => setShowAddComment(true)}>
                Ajouter un commentaire
              </Button>
            </div>
          )}

          {/* Zone de saisie nouveau commentaire */}
          {showAddComment && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Ajouter un commentaire</h3>

              <Textarea
                placeholder="Écrivez votre commentaire..."
                className="min-h-[120px]"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              {/* Zone de upload de fichiers */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Pièces jointes</h4>

                {/* Drop area minimaliste */}
                <div
                  role="button"
                  onClick={openFileDialog}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  data-dragging={isDragging || undefined}
                  className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 flex min-h-20 flex-col items-center justify-center rounded-lg border border-dashed p-3 transition-colors"
                >
                  <input
                    {...getInputProps()}
                    className="sr-only"
                    aria-label="Uploader des fichiers"
                  />
                  <p className="text-xs font-medium">Glisser-déposer ou cliquer pour sélectionner</p>
                  <p className="text-muted-foreground text-[11px]">Tous types et nombre de fichiers acceptés</p>
                </div>

                {/* Liste des fichiers (nom uniquement) */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2"
                      >
                        <p className="truncate text-xs font-medium">
                          {file.file instanceof File ? file.file.name : file.file.name}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground/80 hover:text-foreground hover:bg-transparent"
                          onClick={() => removeFile(file.id)}
                        >
                          Retirer
                        </Button>
                      </div>
                    ))}

                    {files.length > 1 && (
                      <Button size="sm" variant="outline" onClick={clearFiles}>
                        Supprimer tous les fichiers
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setComment("");
                    clearFiles();
                    setShowAddComment(false);
                  }}
                >
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={!comment.trim()}>
                  Ajouter
                </Button>
              </div>
            </div>
          )}
        </div>

                 

         <DialogClose asChild>
           <Button variant="outline" className="mt-4">Fermer</Button>
         </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
