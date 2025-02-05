# OmahTO

OmahTI Tryout Website for prospective students preparing for SNBT 2025.

---

## Table of Contents

- [Commit Message Convention](#commit-message-convention)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [Contact](#contact)

---

## Commit Message Convention

We follow a structured commit message format:

```
<feat || fix || init || build>(<additional info>): <commit_message>
```

### Examples:
- `feat(auth): add JWT authentication`
- `fix(ui): resolve navbar overlapping issue`
- `init(project): setup Next.js with TypeScript`
- `build(deps): update Dockerfile to use Node 18`

---

## Installation

Ensure you have Docker and Docker Desktop installed and configured on your local machine. Then, follow these steps:

```bash
# Clone the repository
git clone https://github.com/vityasyyy/omah-to .
# Then, follow the instructions in the "Usage" section.
```

---

## Usage

To start the development server:

- **To start fresh without prebuilt images:**
  ```bash
  docker compose up --build
  ```

- **To start an existing image (without applying new changes):**
  ```bash
  docker compose up
  ```

- **To stop the development server:**
  ```bash
  docker compose down
  ```

- **To apply new changes:**
  ```bash
  docker compose down && docker compose up --build
  ```

---

## Contributors

[List of contributors here.]

---

## Contact

For any inquiries, feel free to reach out:

- **Email:** [omahti.mipa@ugm.ac.id](mailto:omahti.mipa@ugm.ac.id)
- **Website OmahTI:** [omahti.web.id](https://omahti.web.id)
- **GitHub Issues:** [OmahTO Issues](https://github.com/vityasyyy/omah-to/issues)
```
