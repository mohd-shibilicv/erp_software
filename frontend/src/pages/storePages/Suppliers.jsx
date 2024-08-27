import Layout from '@/components/layout/Layout'
import { SuppliersTable } from '@/components/store/SuppliersTable'
import React from 'react'

const Suppliers = () => {
  return (
    <Layout>
        <h1 className="font-semibold text-2xl">Suppliers</h1>
        <SuppliersTable />
    </Layout>
  )
}

export default Suppliers