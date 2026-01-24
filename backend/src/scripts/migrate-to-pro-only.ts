import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Migration script to transition from BASIC/PRO dual-plan model to PRO-only with subscription status
 * 
 * Strategy:
 * - BASIC tenants → PRO TRIALING (7 days from now)
 * - PRO tenants with active trial → maintain status
 * - PRO tenants without trial → set to ACTIVE
 */
async function migrateToPROOnly() {
    console.log('[Migration] Starting PRO-only migration...\n');

    try {
        // ============== Find all restaurants ==============
        const allRestaurants = await prisma.restaurant.findMany({
            select: {
                id: true,
                name: true,
                plan: true,
                trialStatus: true,
                trialStartAt: true,
                trialEndAt: true,
                trialConsumedAt: true
            }
        });

        console.log(`[Migration] Found ${allRestaurants.length} total restaurants\n`);

        let basicToPROTrialing = 0;
        let proTrialMaintained = 0;
        let proToActive = 0;

        const now = new Date();
        const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

        for (const restaurant of allRestaurants) {
            try {
                // ==== CASE 1: BASIC tenants → PRO TRIALING (7 days) ====
                if (restaurant.plan === 'BASIC') {
                    await prisma.restaurant.update({
                        where: { id: restaurant.id },
                        data: {
                            plan: 'PRO',
                            subscriptionStatus: 'TRIALING',
                            trialStatus: 'ACTIVE',
                            trialStartAt: now,
                            trialEndAt: trialEndsAt,
                            trialConsumedAt: now
                        }
                    });

                    console.log(`✓ [BASIC → TRIALING] ${restaurant.name} - Given 7-day trial`);
                    basicToPROTrialing++;
                }

                // ==== CASE 2: PRO with ACTIVE trial → maintain trial ====
                else if (restaurant.plan === 'PRO' && restaurant.trialStatus === 'ACTIVE') {
                    // Update to use new subscription status
                    await prisma.restaurant.update({
                        where: { id: restaurant.id },
                        data: {
                            subscriptionStatus: 'TRIALING'
                            // Keep existing trial dates
                        }
                    });

                    console.log(`✓ [PRO TRIAL → TRIALING] ${restaurant.name} - Maintained existing trial`);
                    proTrialMaintained++;
                }

                // ==== CASE 3: PRO without trial or expired trial → ACTIVE ====
                else if (restaurant.plan === 'PRO') {
                    await prisma.restaurant.update({
                        where: { id: restaurant.id },
                        data: {
                            subscriptionStatus: 'ACTIVE',
                            subscriptionStartedAt: restaurant.trialConsumedAt || now,
                            // No subscription end date (perpetual for existing customers)
                        }
                    });

                    console.log(`✓ [PRO → ACTIVE] ${restaurant.name} - Set to active subscription`);
                    proToActive++;
                }

            } catch (err) {
                console.error(`✗ [ERROR] Failed to migrate ${restaurant.name}:`, err);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('[Migration] Complete!');
        console.log('='.repeat(60));
        console.log(`BASIC → PRO TRIALING: ${basicToPROTrialing}`);
        console.log(`PRO TRIAL maintained:  ${proTrialMaintained}`);
        console.log(`PRO → ACTIVE:          ${proToActive}`);
        console.log('='.repeat(60) + '\n');

        // ============== Verification ==============
        console.log('[Verification] Checking final state...\n');

        const statusCounts = await prisma.restaurant.groupBy({
            by: ['subscriptionStatus'],
            _count: true
        });

        console.log('Subscription Status Distribution:');
        statusCounts.forEach(({ subscriptionStatus, _count }) => {
            console.log(`  ${subscriptionStatus}: ${_count}`);
        });

        const planCounts = await prisma.restaurant.groupBy({
            by: ['plan'],
            _count: true
        });

        console.log('\nPlan Distribution:');
        planCounts.forEach(({ plan, _count }) => {
            console.log(`  ${plan}: ${_count}`);
        });

        console.log('\n[Migration] ✓ SUCCESS\n');

    } catch (error) {
        console.error('\n[Migration] ✗ FAILED:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration
migrateToPROOnly()
    .catch((error) => {
        console.error('[Migration] Fatal error:', error);
        process.exit(1);
    });
