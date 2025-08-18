<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Ticket #{{ $ticket->id }}</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; color: #111; font-size: 12px; margin: 24px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 16px; }
        .muted { color: #666; font-size: 11px; }
        .section { margin: 14px 0; }
        .grid { display: table; width: 100%; table-layout: fixed; }
        .col { display: table-cell; vertical-align: top; }
        .label { font-weight: bold; color: #333; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 10px; color: #fff; font-weight: bold; font-size: 11px; }
        .status-todo { background: #6c757d; }
        .status-in-progress { background: #f0ad4e; }
        .status-done { background: #28a745; }
        .box { border: 1px solid #ddd; border-radius: 6px; padding: 12px; }
        h1 { margin: 0 0 6px 0; font-size: 20px; }
        h3 { margin: 0 0 8px 0; font-size: 14px; }
        p { margin: 0 0 6px 0; line-height: 1.4; }
    </style>
    </head>
<body>
    <div class="header">
        <h1>Ticket #{{ $ticket->id }}</h1>
        <div class="muted">Généré le {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    <div class="section box">
        <h3>Informations</h3>
        <p><span class="label">Titre :</span> {{ $ticket->title }}</p>
        <p>
            <span class="label">Statut :</span>
            <span class="badge status-{{ $ticket->status }}">{{ ucfirst($ticket->status) }}</span>
        </p>
        <p><span class="label">Priorité :</span> {{ ucfirst($ticket->priority) }}</p>
    </div>

    <div class="section box">
        <h3>Description</h3>
        <p>{{ $ticket->description }}</p>
    </div>

    <div class="section box">
        <h3>Détails</h3>
        <div class="grid">
            <div class="col">
                <p><span class="label">Assigné à :</span> {{ optional($ticket->user)->name ?? 'Non assigné' }}</p>
                <p><span class="label">Créé par :</span> {{ optional($ticket->creator)->name }}</p>
            </div>
            <div class="col">
                <p><span class="label">Créé le :</span> {{ optional($ticket->created_at)->format('d/m/Y H:i') }}</p>
                @if($ticket->done_at)
                    <p><span class="label">Terminé le :</span> {{ optional($ticket->done_at)->format('d/m/Y H:i') }}</p>
                @endif
            </div>
        </div>
    </div>

    @if(isset($ticket->comments) && $ticket->comments->count())
    <div class="section box">
        <h3>Commentaires ({{ $ticket->comments->count() }})</h3>
        @foreach($ticket->comments as $comment)
            <div style="margin-bottom:10px;">
                <p>
                    <span class="label">Par:</span> {{ optional($comment->user)->name ?? 'Utilisateur' }}
                    <span class="muted">— {{ optional($comment->created_at)->format('d/m/Y H:i') }}</span>
                </p>
                <p>{{ $comment->content }}</p>
                @if(isset($comment->attachments) && $comment->attachments->count())
                    <div class="muted">Pièces jointes (images uniquement):</div>
                    @foreach($comment->attachments as $att)
                        @php
                            $ext = strtolower(pathinfo($att->url, PATHINFO_EXTENSION));
                            $isImage = in_array($ext, ['jpg','jpeg','png','gif','webp']);
                        @endphp
                        @if($isImage)
                            <div style="margin:6px 0;">
                                <img src="{{ public_path(ltrim($att->url, '/')) }}" style="max-width:100%; max-height:280px; border:1px solid #ddd; border-radius:4px;" alt="attachment" />
                            </div>
                        @endif
                    @endforeach
                @endif
            </div>
        @endforeach
    </div>
    @endif
</body>
</html>
