# RBD Dashboard 2026

Obchodní dashboard divize RBD — single-page HTML aplikace.

## Nasazení na GitHub Pages

1. Vytvořte nový **GitHub repozitář** (public nebo private)
2. Nahrajte soubor `rbd_v9.html` do repozitáře a přejmenujte ho na `index.html`
3. V nastavení repozitáře → **Settings → Pages** → Source: `main` branch, složka `/ (root)`
4. Za pár minut bude dashboard dostupný na: `https://[vas-username].github.io/[nazev-repo]/`

## Ukládání dat do cloudu (JSONBin.io)

Dashboard podporuje synchronizaci dat přes [JSONBin.io](https://jsonbin.io) (bezplatná služba):

1. Zaregistrujte se na **jsonbin.io**
2. Vytvořte API Key v sekci **Account → API Keys**
3. V dashboardu (záložka **Seznam SoD**) klikněte na **☁ Uložit do webu**
4. Zadejte svůj API Key — uloží se do prohlížeče pro příští použití
5. Data se uloží do cloudu — **Bin ID** se zobrazí v statusu a uloží lokálně

### Načtení dat na jiném zařízení
1. Klikněte **☁ Načíst z webu**
2. Zadejte Bin ID (ze statusu předchozího uložení)
3. Data se obnoví

## Co se ukládá
- Poznámky z review, potenciál Q2, pipeline
- Nastavení SoD a KP hodnot obchodníků
- Úpravy polí Administrátor a Manažer v záznamu SoD
- **Přednahrané SoD záznamy** ze souboru SoD_přehled.xlsx jsou součástí HTML a nemusí se ukládat

## Pravidlo KP a sleva
- ≤ 5 % slevy → 100 % KP
- Každé % nad 5 % snižuje KP o 20 %
- ≥ 10 % slevy → 0 Kč do KP
- Příklad: 7,5 % sleva → 50 % KP; 10 % → 0 KP
