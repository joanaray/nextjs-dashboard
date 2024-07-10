'use server';
import {z} from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

/**
 * Create Invoice
 */
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.'}),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.'
    }),
    date: z.string(),
});
const CreateInvoice = FormSchema.omit({id:true, date:true});

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse( {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }
    const {customerId, amount, status} = validatedFields.data;
    const amountInCents = amount*100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
        revalidatePath('/dashboard/invoices');
    } catch(error) {
        console.log(error);
        return { message: 'Database Error: Failed to Create Invoice.'}
    }

    redirect('/dashboard/invoices')
}

/**
 * Update Invoice
 */
const UpdateInvoice = FormSchema.omit({id:true, date:true});

export async function updateInvoice(id:string, formData:FormData) {
    const {customerId, amount, status} = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
    } catch(error) {
        console.log(error);
        return {message: 'Database Error: Failed to Update Invoice.'}
    }

    redirect('/dashboard/invoices');
}

/**
 * Delete Invoice
 */
export async function deleteInvoice(id:string) {

    try {
        await sql`
        DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
    } catch (error) {
        console.log(error);
        return {message: 'Database Error: Failed to Delete Invoice.' }
    }
    
}

/**
 * User Authentication
 */
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

/**
 * Create new Customer
 */
const CustomerFormSchema = z.object({
    id: z.string(),
    customerName: z.string(),
    customerEmail: z.string(),
    customerPhoto: z.string(),
});

const CreateCustomer = CustomerFormSchema.omit({id:true});

export async function createCustomer(formData:FormData) {
    const {customerName, customerEmail, customerPhoto } = CreateCustomer.parse({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhoto: formData.get('customerPhoto'),
    });

    /**
     * type definitions for your data
     * 
     * export type Customer = {
        id: string;
        name: string;
        email: string;
        image_url: string;
        };
     */

    await sql`
        INSERT INTO customers (name, email, image_url)
        VALUES (${customerName},${customerEmail},${customerPhoto})
    `;

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

/**
 * Delete Customer
 */
export async function deleteCustomer(id:string){
    try{
        await sql`
        DELETE FROM customers WHERE id = ${id}`;
        revalidatePath('/dashboard/customers');
    } catch (error){
        console.log(error);
        return { message: 'Database Error: Failed to Delete Customer.' }
    }
}