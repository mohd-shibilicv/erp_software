import Layout from '@/components/layout/Layout'
import { DamagedProductsTable } from '@/components/store/DamagedProductsTable'
import React from 'react'

const DamagedProductsPage = () => {
  return (
    <Layout>
      <h1 className="font-semibold text-2xl">Damaged Products</h1>
      <DamagedProductsTable />
    </Layout>
  )
}

export default DamagedProductsPage
