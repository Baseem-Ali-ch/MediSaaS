# MediSaaS 🏥
### Medical Laboratory Management SaaS Platform

**MediSaaS** is a cloud-based **Laboratory Information Management System (LIMS)** designed for diagnostic laboratories. It helps labs manage patients, test orders, reports, staff, and billing in one centralized platform.

The system supports **multi-lab and multi-branch architecture**, allowing laboratories to operate and manage their workflow efficiently.

---

# 📌 Key Concepts

## Multi-Tenant System
Multiple laboratories can use the platform, while their data remains isolated using `labId`.

## Reference Range Engine
Test results are automatically compared with reference ranges based on:

- Age
- Gender
- Test type

## Report Result Flags

The system automatically flags results:

- **Low**
- **Normal**
- **High**
- **Critical**

---

# 🛠 Installation

## Clone the Repository

```bash
git clone https://github.com/Baseem-Ali-ch/MediSaaS
cd medisaas
