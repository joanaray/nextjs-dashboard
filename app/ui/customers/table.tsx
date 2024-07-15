import Image from 'next/image';
import Search from '@/app/ui/search';
import { CreateCustomer, UpdateCustomer, DeleteCustomer } from '@/app/ui/customers/buttons';
import { lusitana } from '@/app/ui/fonts';
import { FormattedCustomersTable } from '@/app/lib/definitions';
import { fetchCustomersPages } from '@/app/lib/data';
import Pagination from '@/app/ui/pagination';
import { Suspense } from 'react';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';

export default async function CustomersTable({
  query,
  pageTitle,
  customers
}: {
  query: string;
  pageTitle: string;
  customers: FormattedCustomersTable[];
}) {

  const totalPages = await fetchCustomersPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
      <h1 className={`${lusitana.className} text-2x1`}>
        {pageTitle}
      </h1>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 md:mt-8">
        <Search pageTitle={pageTitle} />
        <CreateCustomer />
      </div>
      <Suspense fallback={<CustomersTableSkeleton />}>      
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {customers.length < 1 &&
                <div className='w-full rounded-md bg-white p-4 text-center'>No results found for &quot;{query}&quot;</div>
                }
                {customers?.map((customer) => (
                  <div
                    key={customer.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={customer.image_url}
                              className="rounded-full"
                              alt={`${customer.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p>{customer.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Pending</p>
                        <p className="font-medium">{customer.total_pending}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Paid</p>
                        <p className="font-medium">{customer.total_paid}</p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <p>{customer.total_invoices} invoices</p>
                    </div>
                    <div className="flex pt-4 text-sm justify-end gap-2">
                      <UpdateCustomer id={customer.id} />
                      <DeleteCustomer id={customer.id} />
                  </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Invoices
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Pending
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Paid
                    </th>
                    <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {customers.length < 1 && <tr className="group"><td colSpan={5} className='py-3 text-center'>No results found for &quot;{query}&quot;</td></tr>}
                  {customers.map((customer) => (
                    <tr key={customer.id} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={customer.image_url}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{customer.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {customer.total_invoices}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {customer.total_pending}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {customer.total_paid}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <div className="flex justify-end gap-3">
                          <UpdateCustomer id={customer.id} />
                          <DeleteCustomer id={customer.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        < Pagination totalPages={totalPages} />
      </div>     
    </div>
  );
}
