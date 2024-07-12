## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

### Upgrades

This tutorial handles invoice data manipulation (create, update, delete) but I implemented that also for customers data.

Here's what I added to the initial tutorial:
* Implemented server side form validation to invoices and customers forms (tutorial only had form validation for the "create a new invoice" form).
* It's possible to create, delete and update customers (except for photos because I wasn't sure how to handle file upload so I'm just feeding that part from [thispersondoesnotexist.com](https://thispersondoesnotexist.com/)).
* Updated the search feature to include a "No results found for [searched query]" in case no results were returned.
* Removed placeholder prop from forms for accessibility reasons. [Read about it here](https://www.deque.com/blog/accessible-forms-the-problem-with-placeholders/)

Anyway, feel free to snoop around.
