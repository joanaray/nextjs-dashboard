import CustomersTable from "@/app/ui/customers/table";
import { Metadata } from "next";
import { fetchFilteredCustomers } from "@/app/lib/data";

export const metadata: Metadata = {
  title: 'Customers',
}
const pageTitle = 'Customers';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string,
    page?: string,
  }
}) {
  const query = searchParams?.query || ''
  const totalCustomers = await fetchFilteredCustomers(query);

    return <CustomersTable pageTitle={pageTitle} customers={totalCustomers} query={query}/> ;
  }