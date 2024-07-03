'use client'; // This is a Client Component, which means you can use event listeners and hooks.

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce';

export default function Search() {
  const searchParams = useSearchParams();
  const pathName=usePathname();
  const {replace} = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(term);

    const params = new URLSearchParams(searchParams);
    if(term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathName}?${params.toString()}`);
  }, 300);
  
  return (
    <div className="relative flex flex-1 flex-shrink-0 flex-wrap">
      <label htmlFor="search" className="w-full">
        Search invoices
      </label>
      <div className='flex align-items-center'>
        <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute top-8 left-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-900" />
      </div>
      
    </div>
  );
}
