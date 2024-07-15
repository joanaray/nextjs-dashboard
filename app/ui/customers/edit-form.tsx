'use client';

import { Customer } from "@/app/lib/definitions";
import { updateCustomer, CustomerState } from "@/app/lib/actions";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/ui/button";
import { UserCircleIcon, AtSymbolIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";

export default function EditCustomerForm({customer}: {customer: Customer}){

    const initialState: CustomerState = {message: null, errors: {}};
    const handleUpdateCustomer = (prevState: CustomerState, formData: FormData) => {
        return updateCustomer(prevState, customer.id, formData);
    };
    const [state, formAction] = useActionState(handleUpdateCustomer, initialState);
    
    return (
        <form action={formAction}>
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    <div className="mb-4">
                        <Image
                        src={customer.image_url}
                        className="rounded-full"
                        alt={`${customer.name}'s profile picture`}
                        width={100}
                        height={100}
                        />
                    </div>
                    {/** Customer Name */}
                    <div className="mb-4">
                        <label htmlFor="customerName" className="mb-2 block text-sm font-medium">Name</label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input id="customerName" name="customerName" type="text" className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                defaultValue={customer.name}
                                aria-describedby="name-error" />
                                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                            </div>
                            <div id="name-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.customerName && state.errors.customerName.map((error:string) => (<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>))}
                                
                            </div>
                        </div>
                    </div>
                    {/** Customer email */}
                    <div className="mb-4">
                        <label htmlFor="customerEmail" className="mb-2 block text-sm font-medium">Email</label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input type="email" name="customerEmail" id="customerEmail" className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                defaultValue={customer.email}
                                aria-describedby="email-error" />
                                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                            </div>
                            <div id="email-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.customerEmail && state.errors.customerEmail.map((error:string) => (<p className="mt-2 text-sm text-red-500" key={error}>{error}</p>))}
                                
                            </div>
                        </div>
                    </div>
                    {/** Customer photo */}
                    <div>
                        <label htmlFor="customerPhoto" className="mb-2 block text-sm font-medium">Photo</label>
                        
                        <div className="relative mt-2 rounded-md">
                            <div className="flex w-full rounded-md border border-gray-200 py-2 text-sm outline-2">
                                <PhotoIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                                <p className="text-sm pl-10">Let&apos;s not mess with photo updates.</p>
                                <input type="hidden" name="customerPhoto" id="customerPhoto" className=" peer block" defaultValue={customer.image_url}/>                                
                            </div>
                        </div>
                        </div>
                        <div id="missing-fields-error" aria-live='polite' aria-atomic='true'>
                            {(state.errors?.customerName || state.errors?.customerEmail || state.errors?.customerPhoto) && <p className='mt-2 text-sm text-red-500'>Missing Fields. Failed to Update Customer info.</p>}
                        </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Link href="/dashboard/customers" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">Cancel</Link>
                    <Button type='submit'>Edit Customer</Button>
                </div>
            </form>
    )
}