import Breadcrumbs from "@/app/ui/breadcrumbs";
import { createCustomer } from "@/app/lib/actions";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { Metadata } from "next";
import { UserCircleIcon, AtSymbolIcon, PhotoIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
    title: 'Add new Customer',
}

export default async function Page(){

    return(
        <main>
            <Breadcrumbs breadcrumbs={[
                {label: 'Customers', href: '/dashboard/customers'},
                {label: 'Create Customer', href: '', active:true,
                }
            ]}/>
            <form action={createCustomer}>
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    {/** Customer Name */}
                    <div className="mb-4">
                        <label htmlFor="customerName" className="mb-2 block text-sm font-medium">Name</label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input id="customerName" name="customerName" type="text" className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
                                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>
                    </div>
                    {/** Customer email */}
                    <div className="mb-4">
                        <label htmlFor="customerEmail" className="mb-2 block text-sm font-medium">Email</label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input type="email" name="customerEmail" id="customerEmail" className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
                                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>
                    </div>
                    {/** Customer photo */}
                    <div>
                        <label htmlFor="customerPhoto" className="mb-2 block text-sm font-medium">Photo</label>
                        
                        <div className="relative mt-2 rounded-md">
                            <div className="flex w-full rounded-md border border-gray-200 py-2 text-sm outline-2">
                                <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                                <p className="text-sm pl-10">Using https://thispersondoesnotexist.com/ to fetch a random pic.</p>
                                <input type="hidden" name="customerPhoto" id="customerPhoto" className=" peer block" value="https://thispersondoesnotexist.com/"/>
                                
                            </div>
                        </div>
                        </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Link href="/dashboard/customers" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">Cancel</Link>
                    <Button type='submit'>Add New Customer</Button>
                </div>
            </form>
        </main>
    )
}