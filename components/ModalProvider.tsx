'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

type ModalContextType = {
  deliveryOpen: boolean
  aboutOpen: boolean
  contactsOpen: boolean
  paymentOpen: boolean
  adminOpen: boolean
  openDeliveryModal: () => void
  closeDeliveryModal: () => void
  openAboutModal: () => void
  closeAboutModal: () => void
  openContactsModal: () => void
  closeContactsModal: () => void
  openPaymentModal: () => void
  closePaymentModal: () => void
  openAdminModal: () => void
  closeAdminModal: () => void
  closeAllModals: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [deliveryOpen, setDeliveryOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [contactsOpen, setContactsOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)

  const closeAllModals = () => {
    setDeliveryOpen(false)
    setAboutOpen(false)
    setContactsOpen(false)
    setPaymentOpen(false)
    setAdminOpen(false)
  }

  const openDeliveryModal = () => {
    closeAllModals()
    setDeliveryOpen(true)
  }

  const openAboutModal = () => {
    closeAllModals()
    setAboutOpen(true)
  }

  const openContactsModal = () => {
    closeAllModals()
    setContactsOpen(true)
  }

  const openPaymentModal = () => {
    closeAllModals()
    setPaymentOpen(true)
  }

  const openAdminModal = () => {
    closeAllModals()
    setAdminOpen(true)
  }

  const closeDeliveryModal = () => setDeliveryOpen(false)
  const closeAboutModal = () => setAboutOpen(false)
  const closeContactsModal = () => setContactsOpen(false)
  const closePaymentModal = () => setPaymentOpen(false)
  const closeAdminModal = () => setAdminOpen(false)

  return (
    <ModalContext.Provider
      value={{
        deliveryOpen,
        aboutOpen,
        contactsOpen,
        paymentOpen,
        adminOpen,
        openDeliveryModal,
        closeDeliveryModal,
        openAboutModal,
        closeAboutModal,
        openContactsModal,
        closeContactsModal,
        openPaymentModal,
        closePaymentModal,
        openAdminModal,
        closeAdminModal,
        closeAllModals,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within ModalProvider')
  }
  return context
}
