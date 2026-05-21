'use client';
import { useState } from 'react';
import { useCustomers, usePlans } from '@/hooks/useApi';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Table, Pagination } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Plus, Search } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS, formatDate } from '@/lib/utils';
import { Customer } from '@/types';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateCustomer } from '@/hooks/useApi';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { data, isLoading } = useCustomers({ page, limit: 10, search: search || undefined, status: status || undefined });
  const { data: plans } = usePlans();
  const createCustomer = useCreateCustomer();

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (formData: any) => {
    try {
      const userRes = await api.post('/users', { name: formData.name, email: formData.email, password: formData.password, role: 'CLIENTE' });
      await createCustomer.mutateAsync({ ...formData, userId: userRes.data.id });
      setShowModal(false);
      reset();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Erro ao cadastrar');
    }
  };

  const columns = [
    { key: 'user', header: 'Cliente', render: (r: Customer) => <div><p className="font-medium text-white">{r.user?.name}</p><p className="text-xs text-slate-400">{r.user?.email}</p></div> },
    { key: 'document', header: 'Documento' },
    { key: 'plan', header: 'Plano', render: (r: Customer) => <span className="text-blue-400">{r.plan?.name}</span> },
    { key: 'city', header: 'Cidade', render: (r: Customer) => `${r.city}/${r.state}` },
    { key: 'serviceStatus', header: 'Status', render: (r: Customer) => <Badge label={STATUS_LABELS[r.serviceStatus]} className={STATUS_COLORS[r.serviceStatus]} /> },
    { key: 'contractStart', header: 'Desde', render: (r: Customer) => formatDate(r.contractStart) },
  ];

  return (
    <div>
      <Header title="Clientes" subtitle="Gerenciamento de clientes e planos" />

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por nome, documento ou cidade..." className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos os status</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="DEGRADED">Degradado</option>
          </select>
          <Button onClick={() => setShowModal(true)}><Plus size={16} />Novo Cliente</Button>
        </div>

        <Table columns={columns} data={data?.data ?? []} isLoading={isLoading} onRowClick={r => router.push(`/customers/${r.id}`)} />
        {data && <Pagination page={page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Cadastrar Cliente" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nome completo" {...register('name', { required: true })} />
            <Input label="Email" type="email" {...register('email', { required: true })} />
            <Input label="Senha" type="password" {...register('password', { required: true })} />
            <Input label="Documento (CPF/CNPJ)" {...register('document', { required: true })} />
            <Input label="Telefone" {...register('phone', { required: true })} />
            <Input label="CEP" {...register('zipCode', { required: true })} />
            <Input label="Endereço" {...register('address', { required: true })} />
            <Input label="Cidade" {...register('city', { required: true })} />
            <Input label="Estado" {...register('state', { required: true })} />
            <Select label="Plano" {...register('planId', { required: true })}>
              <option value="">Selecione um plano</option>
              {plans?.map((p: any) => <option key={p.id} value={p.id}>{p.name} - R$ {p.price}</option>)}
            </Select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" isLoading={isSubmitting} className="flex-1">Cadastrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
