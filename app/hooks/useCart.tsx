import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addCart } from '../data/cart/addCart'
import { cartCount } from '../data/cart/cartCount'
import { useToastStore } from '../store/toastStore'
import { deleteCart } from '../data/cart/deleteCart'
import { plusMinus } from '../data/cart/plusMinus'


export function useCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cartCount'] })
      useToastStore.getState().showToast(data.message)
    },
    onError: (err: Error) => {
      useToastStore.getState().showToast(err.message)
    },
  })
}

export function useCartCount() {
  return useQuery({
    queryKey : ['cartCount'],
    queryFn : cartCount,
    retry: false,
  })
}

export function useCartDelete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : deleteCart,
    onSuccess : (data) => {
      queryClient.invalidateQueries({queryKey : ['cartCount']})
      useToastStore.getState().showToast(data.message)
    }
  })
}

export function useCartplustMinus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : plusMinus,
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey : ['cartCount']})
    }
  })
}

