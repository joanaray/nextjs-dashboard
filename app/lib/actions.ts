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
    }).min(1, 'Please select a customer.'),
    amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.'}),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.'
    }),
    date: z.string(),
});
const InvoiceSchema = FormSchema.omit({id:true, date:true});

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {

    const validatedFields = InvoiceSchema.safeParse( {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    console.log('Form data: ', {
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    console.log('Form validation: ', validatedFields);

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

export async function updateInvoice(prevState: State, id:string, formData:FormData) {

    const validatedFields = InvoiceSchema.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if(!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const {customerId, amount, status} = validatedFields.data;
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

// Zod verifies the type of data but not if it's empty, so this form kept getting validated even if the fields were empty. Added .min() to text inputs to make sure they wouldn't be left empty by the user and extra .email() to the email input (even though it's already type=email, but I guess this sort of redundancy may be welcomed. )
const CustomerFormSchema = z.object({
    id: z.string(),
    customerName: z.string({
        invalid_type_error: `Please enter the customer's name.`,
    }).min(1, `Please enter the customer's name.`),
    customerEmail: z.string({
        invalid_type_error: `Please enter the customer's email.`,
    }).email('Please enter a valid email.'),
    customerPhoto: z.string({
        invalid_type_error: `Please enter the customer's photo.`,
    }),
});

const CreateCustomer = CustomerFormSchema.omit({id:true});

export type CustomerState = {
    errors?: {
        customerName?: string[];
        customerEmail?: string[];
        customerPhoto?: string[];
    };
    message?: string | null;
};
export async function createCustomer(prevState: CustomerState, formData: FormData) {

    const validatedFields = CreateCustomer.safeParse({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhoto: formData.get('customerPhoto'),
    });

    console.log('Form Data:', {
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhoto: formData.get('customerPhoto'),
    });
    console.log('Validation Result:', validatedFields);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create New Customer.',
        };
    }

    const {customerName, customerEmail, customerPhoto} = validatedFields.data;

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
    try {
        await sql`
        INSERT INTO customers (name, email, image_url)
        VALUES (${customerName}, ${customerEmail}, ${customerPhoto})`;
        revalidatePath('/dashboard/customers');
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create New Customer.',
        };
    }
    
    redirect('/dashboard/customers');
}

/**
 * Update Customer
 */
const UpdateCustomer = CustomerFormSchema.omit({id:true});

export async function updateCustomer(id: string, formData:FormData) {
    const {customerName, customerEmail, customerPhoto } = UpdateCustomer.parse({
        customerName: formData.get('customerName'),
        customerEmail: formData.get('customerEmail'),
        customerPhoto: formData.get('customerPhoto'),
    });

    try{
        await sql`
        UPDATE customers
        SET name = ${customerName}, email = ${customerEmail}, image_url = ${customerPhoto}
        WHERE id = ${id} `;

        revalidatePath('/dashboard/customers');
    } catch (error) {
        console.log(error);
        return { message: 'Database Error: Failed to Update Customer.' }
    }

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
        return { message: 'Deleted Customer' };
    } catch (error){
        console.log(error);
        return { message: 'Database Error: Failed to Delete Customer.' }
    }
}