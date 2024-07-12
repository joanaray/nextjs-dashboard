import Breadcrumbs from "@/app/ui/breadcrumbs";
import { Metadata } from "next";
import CreateCustomerForm from "@/app/ui/customers/create-form";

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
            <CreateCustomerForm />
        </main>
    )
}