import EditCustomerForm from "@/app/ui/customers/edit-form";
import Breadcrumbs from "@/app/ui/breadcrumbs";
import {fetchCustomerById} from '@/app/lib/data'

export default async function Page({params}: {params:{id:string}}){
    const id = params.id;
    const customer = await fetchCustomerById(id);
    
    return (
        <main>
            <Breadcrumbs
            breadcrumbs={[
                {label: 'Customers', href: '/dashboard/customers'},
                {label: 'Edit Customer', href: `/dashboard/customers/${id}/edit`, active:true}
            ]}/>
            <EditCustomerForm customer={customer} />
        </main>
    )
}