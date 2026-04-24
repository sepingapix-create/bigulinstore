"use client";

import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  User as UserIcon,
  Shield,
  Star,
  Search,
  Trash2,
  Users,
  UserCheck,
  ShieldOff,
  Crown,
  Filter,
  CalendarDays,
  DollarSign,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateUserRoleAction, toggleAffiliateStatusAction, deleteUserAction, addAffiliateBalanceAction } from "@/actions/admin";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  isAffiliate: boolean;
  createdAt: Date;
}

type FilterType = "all" | "admin" | "affiliate" | "user";

function UserAvatar({ name }: { name: string | null }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";
  const colors = [
    "from-red-500 to-orange-500",
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-amber-500",
  ];
  const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length];
  return (
    <div
      className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 font-black text-white text-xs shadow-md`}
    >
      {initials}
    </div>
  );
}

export function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    affiliates: users.filter((u) => u.isAffiliate).length,
    regular: users.filter((u) => u.role === "USER" && !u.isAffiliate).length,
  }), [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchFilter =
        filter === "all" ||
        (filter === "admin" && u.role === "ADMIN") ||
        (filter === "affiliate" && u.isAffiliate) ||
        (filter === "user" && u.role === "USER" && !u.isAffiliate);
      return matchSearch && matchFilter;
    });
  }, [users, search, filter]);

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setLoadingId(userId);
    const result = await updateUserRoleAction(userId, newRole as "USER" | "ADMIN");
    setLoadingId(null);
    if (result.success) {
      toast.success(`Cargo atualizado para ${newRole}`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as "USER" | "ADMIN" } : u)));
    } else {
      toast.error(result.error);
    }
  };

  const handleToggleAffiliate = async (userId: string, current: boolean) => {
    setLoadingId(userId);
    const result = await toggleAffiliateStatusAction(userId, !current);
    setLoadingId(null);
    if (result.success) {
      toast.success(!current ? "Afiliado aprovado!" : "Afiliado removido");
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isAffiliate: !current } : u)));
    } else {
      toast.error(result.error);
    }
  };

  const handleOpenBalanceDialog = (user: User) => {
    setSelectedUser(user);
    setBalanceAmount("");
    setIsBalanceOpen(true);
  };

  const handleConfirmBalance = async () => {
    if (!selectedUser) return;
    
    const amount = parseFloat(balanceAmount.replace(",", "."));
    if (isNaN(amount) || amount <= 0) {
      toast.error("Valor inválido");
      return;
    }

    setLoadingId(selectedUser.id);
    setIsBalanceOpen(false);
    const result = await addAffiliateBalanceAction(selectedUser.id, amount);
    setLoadingId(null);

    if (result.success) {
      toast.success(`Saldo de R$ ${amount.toFixed(2)} adicionado para ${selectedUser.name}!`);
    } else {
      toast.error(result.error || "Erro ao adicionar saldo");
    }
  };

  const handleDelete = async (userId: string, name: string | null) => {
    if (!confirm(`Excluir "${name || "usuário"}" permanentemente?`)) return;
    setLoadingId(userId);
    const result = await deleteUserAction(userId);
    setLoadingId(null);
    if (result.success) {
      toast.success("Usuário excluído");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      toast.error(result.error);
    }
  };

  const filters: { key: FilterType; label: string; count: number; color: string }[] = [
    { key: "all", label: "Todos", count: stats.total, color: "text-white" },
    { key: "admin", label: "Admins", count: stats.admins, color: "text-red-400" },
    { key: "affiliate", label: "Afiliados", count: stats.affiliates, color: "text-yellow-400" },
    { key: "user", label: "Usuários", count: stats.regular, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">
          Gestão de <span className="text-primary">Usuários</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Controle de acesso e status de parceiros do Império.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total", value: stats.total, color: "text-white", bg: "bg-white/5" },
          { icon: Crown, label: "Admins", value: stats.admins, color: "text-red-400", bg: "bg-red-500/10" },
          { icon: Star, label: "Afiliados", value: stats.affiliates, color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { icon: UserIcon, label: "Usuários", value: stats.regular, color: "text-muted-foreground", bg: "bg-white/5" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] p-4 flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{label}</p>
              <p className={`text-xl font-black ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            className="pl-10 bg-[#0A0A0A] border-[#1A1A1A] rounded-xl h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                filter === f.key
                  ? "bg-primary text-white border-primary"
                  : "bg-[#0A0A0A] border-[#1A1A1A] text-muted-foreground hover:border-primary/40 hover:text-white"
              }`}
            >
              {f.label}
              <span className={`text-[10px] opacity-70 ${filter === f.key ? "text-white" : f.color}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* User Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-[#1A1A1A]">
          <Users className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground font-semibold">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#1A1A1A] bg-[#0A0A0A] overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_60px_140px_120px_140px] gap-4 px-5 py-3 bg-[#111111] border-b border-[#1A1A1A] text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span>Usuário</span>
            <span className="text-right pr-2">Ações</span>
            <span>Cargo</span>
            <span>Afiliado</span>
            <span className="flex items-center gap-1 justify-end"><CalendarDays className="h-3 w-3" /> Registro</span>
          </div>

          <div className="divide-y divide-[#1A1A1A]">
            {filtered.map((user) => {
              const isLoading = loadingId === user.id;
              return (
                  <div
                    key={user.id}
                    className={cn(
                      "grid grid-cols-1 md:grid-cols-[1fr_60px_140px_120px_140px] gap-4 px-5 py-4 items-center transition-colors",
                      isLoading ? "opacity-50 pointer-events-none" : "hover:bg-white/[0.02]"
                    )}
                  >
                    {/* User info */}
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.name} />
                      <div>
                        <p className="font-bold text-sm">{user.name || "Sem Nome"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pr-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                          <MoreHorizontal className="h-4 w-4 pointer-events-none" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-[#0D0D0D] border-[#1A1A1A] rounded-xl p-1.5">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-2 pt-2 pb-1">
                              Acesso
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="rounded-lg gap-2 cursor-pointer text-sm"
                              onClick={() => handleUpdateRole(user.id, user.role)}
                            >
                              {user.role === "ADMIN" ? (
                                <><ShieldOff className="h-4 w-4 text-muted-foreground" /> Remover Admin</>
                              ) : (
                                <><Crown className="h-4 w-4 text-red-400" /> Tornar Admin</>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuGroup>

                          <DropdownMenuSeparator className="bg-[#1A1A1A] my-1" />

                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-2 pt-1 pb-1">
                              Parceria
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="rounded-lg gap-2 cursor-pointer text-sm"
                              onClick={() => handleToggleAffiliate(user.id, user.isAffiliate)}
                            >
                              {user.isAffiliate ? (
                                <><Star className="h-4 w-4 text-muted-foreground" /> Remover Afiliado</>
                              ) : (
                                <><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> Aprovar Afiliado</>
                              )}
                            </DropdownMenuItem>
                            {user.isAffiliate && (
                              <DropdownMenuItem
                                className="rounded-lg gap-2 cursor-pointer text-sm text-green-400 focus:text-green-400 focus:bg-green-500/10"
                                onClick={() => handleOpenBalanceDialog(user)}
                              >
                                <DollarSign className="h-4 w-4" /> Adicionar Saldo
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>

                          <DropdownMenuSeparator className="bg-[#1A1A1A] my-1" />

                          <DropdownMenuItem
                            className="rounded-lg gap-2 cursor-pointer text-sm text-red-400 focus:text-red-400 focus:bg-red-500/10"
                            onClick={() => handleDelete(user.id, user.name)}
                          >
                            <Trash2 className="h-4 w-4" /> Excluir Usuário
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Role */}
                    <div>
                      {user.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600/15 text-red-400 text-[10px] font-black uppercase border border-red-500/20">
                          <Shield className="h-3 w-3" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-muted-foreground text-[10px] font-black uppercase border border-white/5">
                          <UserIcon className="h-3 w-3" /> User
                        </span>
                      )}
                    </div>

                    {/* Affiliate */}
                    <div>
                      {user.isAffiliate ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-[10px] font-black uppercase border border-yellow-500/20">
                          <Star className="h-3 w-3 fill-yellow-400" /> Ativo
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-bold uppercase opacity-40">
                          Inativo
                        </span>
                      )}
                    </div>

                    {/* Date */}
                    <div className="text-xs text-muted-foreground text-right">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Balance Dialog */}
      <Dialog open={isBalanceOpen} onOpenChange={setIsBalanceOpen}>
        <DialogContent className="bg-[#0D0D0D] border-[#1A1A1A] text-white sm:max-w-md overflow-hidden p-0 rounded-3xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-green-600 to-emerald-400" />
          
          <div className="p-8">
            <DialogHeader className="mb-8">
              <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
                Adicionar <span className="text-green-400">Saldo</span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base">
                Insira o valor que deseja creditar na conta de <span className="text-white font-bold">{selectedUser?.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Valor da Recarga (R$)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-green-400">R$</span>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="0,00"
                    className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl text-xl font-black focus:ring-green-500/20 focus:border-green-500/40 transition-all"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Destinatário:</span>
                  <span className="font-bold">{selectedUser?.email}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Tipo de Transação:</span>
                  <span className="text-green-400 font-bold uppercase">Crédito Manual</span>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-10 gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsBalanceOpen(false)}
                className="h-12 rounded-2xl font-bold uppercase text-xs hover:bg-white/5 text-muted-foreground"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmBalance}
                className="h-12 rounded-2xl px-8 bg-green-600 hover:bg-green-500 text-white font-black uppercase italic transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-600/20"
              >
                Confirmar Crédito
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
