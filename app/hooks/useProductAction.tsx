
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productsAction } from '../data/product/productsAction'

export function useProductAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn : (id: number) => productsAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}