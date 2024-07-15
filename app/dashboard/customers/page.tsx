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
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalCustomers = await fetchFilteredCustomers(query, currentPage);

    return <CustomersTable pageTitle={pageTitle} customers={totalCustomers} query={query}/> ;
  }