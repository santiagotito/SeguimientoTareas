import { useState, useCallback, useRef } from 'react';

interface SyncOperation<T> {
  id: string;
  operation: 'create' | 'update' | 'delete';
  item: T;
  timestamp: number;
}

interface UseOptimisticDataOptions<T> {
  syncFn: (operation: 'create' | 'update' | 'delete', item: T) => Promise<void>;
  onSyncError?: (error: Error, operation: SyncOperation<T>) => void;
  onSyncSuccess?: (operation: SyncOperation<T>) => void;
}

/**
 * Hook para manejo optimista de datos con sincronización en background
 *
 * Patrón:
 * 1. Actualiza estado inmediatamente (optimistic update)
 * 2. Sincroniza con servidor en background
 * 3. Maneja errores sin bloquear UI
 */
export function useOptimisticData<T extends { id: string }>(
  initialData: T[],
  options: UseOptimisticDataOptions<T>
) {
  const [data, setData] = useState<T[]>(initialData);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncQueueRef = useRef<SyncOperation<T>[]>([]);

  // Procesar cola de sincronización
  const processSyncQueue = useCallback(async () => {
    if (syncQueueRef.current.length === 0 || isSyncing) return;

    setIsSyncing(true);

    while (syncQueueRef.current.length > 0) {
      const operation = syncQueueRef.current[0];

      try {
        await options.syncFn(operation.operation, operation.item);
        options.onSyncSuccess?.(operation);
        syncQueueRef.current.shift(); // Remover de la cola
      } catch (error) {
        console.error('Error sincronizando:', error);
        options.onSyncError?.(error as Error, operation);
        // No remover de la cola - reintentar después
        break;
      }
    }

    setIsSyncing(false);
  }, [isSyncing, options]);

  // Agregar a cola de sincronización
  const queueSync = useCallback((operation: SyncOperation<T>) => {
    syncQueueRef.current.push(operation);
    // Procesar cola de forma asíncrona (no bloquea)
    setTimeout(() => processSyncQueue(), 0);
  }, [processSyncQueue]);

  // CREAR: Agregar inmediatamente + sincronizar en background
  const create = useCallback((item: T) => {
    // 1️⃣ Actualizar estado inmediatamente
    setData(prev => [...prev, item]);

    // 2️⃣ Agregar a cola de sincronización
    queueSync({
      id: item.id,
      operation: 'create',
      item,
      timestamp: Date.now()
    });
  }, [queueSync]);

  // ACTUALIZAR: Actualizar inmediatamente + sincronizar en background
  const update = useCallback((item: T) => {
    // 1️⃣ Actualizar estado inmediatamente
    setData(prev => prev.map(existing =>
      existing.id === item.id ? item : existing
    ));

    // 2️⃣ Agregar a cola de sincronización
    queueSync({
      id: item.id,
      operation: 'update',
      item,
      timestamp: Date.now()
    });
  }, [queueSync]);

  // ELIMINAR: Eliminar inmediatamente + sincronizar en background
  const remove = useCallback((item: T) => {
    // 1️⃣ Eliminar del estado inmediatamente
    setData(prev => prev.filter(existing => existing.id !== item.id));

    // 2️⃣ Agregar a cola de sincronización
    queueSync({
      id: item.id,
      operation: 'delete',
      item,
      timestamp: Date.now()
    });
  }, [queueSync]);

  // REEMPLAZAR todos los datos (para carga inicial o sincronización completa)
  const setAll = useCallback((newData: T[]) => {
    setData(newData);
  }, []);

  // SINCRONIZAR: Forzar sincronización de cola pendiente
  const syncNow = useCallback(async () => {
    await processSyncQueue();
  }, [processSyncQueue]);

  return {
    data,
    isSyncing,
    pendingOperations: syncQueueRef.current.length,
    create,
    update,
    remove,
    setAll,
    syncNow
  };
}
