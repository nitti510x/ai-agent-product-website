# Consolidated Migrations

This directory contains consolidated migration files that combine multiple related migrations from the parent directory for better organization and documentation.

## Purpose

These consolidated files serve as reference documentation and are **not intended to be run directly**. They provide a clearer picture of the database schema evolution by grouping related changes together.

## Files

- **20250302_stripe_integration_consolidated.sql**: Combines the Stripe integration migrations from March 1-2, 2025
- **20250303_plan_features_consolidated.sql**: Combines all plan features related migrations from March 3, 2025

## Usage

When adding new migrations, consider updating the relevant consolidated file to maintain comprehensive documentation of the database schema.

## Original Migrations

The original migration files in the parent directory remain the source of truth for actual database migrations and should be used with the Supabase CLI for applying changes to the database.
