const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createBudgetPlaygroundProject() {
  try {
    // Check if user exists, create one if not
    let user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found, creating default admin user...');
      user = await prisma.user.create({
        data: {
          email: 'admin@ajplayground.org',
          name: 'AJ Admin',
          role: 'admin',
        }
      });
      console.log('Created user:', user.email);
    }

    // Check if Budget Balancer project already exists
    const existingProject = await prisma.playgroundProject.findUnique({
      where: { slug: 'budget-balancer' }
    });

    if (existingProject) {
      console.log('Budget Balancer project already exists');
      return;
    }

    // Create the Budget Balancer playground project
    const project = await prisma.playgroundProject.create({
      data: {
        slug: 'budget-balancer',
        title: 'Budget Balancer',
        emoji: '💰',
        description: 'A comprehensive budget management tool that helps you balance your finances, track expenses, and achieve your savings goals. Built with beautiful animations and a modern UI.',
        shortDescription: 'Balance your budget, one paycheck at a time',
        content: `# Budget Balancer

The Budget Balancer is a powerful financial planning tool that allows you to:

## Features
- **Paycheck Management**: Track regular and extra income sources
- **Expense Tracking**: Categorize and monitor your spending
- **Savings Goals**: Set and work towards financial objectives
- **Bills Management**: Keep track of recurring payments
- **Beautiful UI**: Enjoy a modern, animated interface

## How to Use
1. **Set Up Paychecks**: Enter your regular paycheck amounts and dates
2. **Add Expenses**: Categorize your spending to see where your money goes
3. **Create Goals**: Set savings targets and allocate funds towards them
4. **Manage Bills**: Track recurring payments and due dates

This tool helps you take control of your finances with an intuitive, visually appealing interface that makes budgeting actually enjoyable!`,
        category: 'Finance',
        isLive: true,
        isAbandoned: false,
        authorId: user.id,
      },
    });

    console.log('Created Budget Balancer playground project:', project.slug);
    console.log('✅ Budget Balancer is now available at /playground/budget-balancer');
  } catch (error) {
    console.error('Error creating Budget Balancer project:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBudgetPlaygroundProject();
