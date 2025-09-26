# Tunnel 

## Prediction Market Platform

Tunnel is a decentralized, no-loss staking platform built on the Flow blockchain that makes cryptocurrency staking engaging and educational through gamified knowledge challenges based on real-world news events. Users stake FLOW tokens to earn passive yields from network delegation, with challenges acting as a fun, skill-based layer to unlock or accelerate those yields—without any risk of losing principal or accrued rewards.

### Core Concept

The platform creates a habit-forming experience similar to quiz apps, where participation rewards accuracy and research, promoting long-term retention and financial literacy. Tunnel pools user stakes and delegates them to Flow node operators, generating sustainable yields (typically 4-8% APR after node cuts). Predictions are resolved trustlessly, focusing on skill over chance, ensuring capital preservation while adding interactive elements to traditional staking.

## Key Features

### 🔒 No-Loss Staking & Vesting
- Users deposit FLOW tokens into a secure, pooled system delegated to Flow node operators
- Yields accrue continuously and are distributed pro-rata based on each user's share
- Principal and yields are protected—never deducted, even on challenge losses
- Stakes lock indefinitely or with a cooldown (e.g., 30 days for withdrawals)

### 📊 Daily Credit System
- Stakes generate non-monetary "credit points" for participating in challenges
- Credits refresh daily via block timestamps (24-hour cooldown)
- Formula: `currentCredit = (principalShare + lockedYield) * dailyRate`
- Promotes daily engagement without financial pressure

### 🎯 Gamified Knowledge Challenges
- Educational quizzes on news events with research-backed questions
- Binary predictions (yes/no) with verifiable resolution data
- **Correct Answer (Win)**: Unlocks accrued yields instantly + bonus multiplier
- **Incorrect Answer (Loss)**: No penalties—yields continue accruing but stay locked
- Features leaderboards, badges, accuracy streaks, and level progression

### 💰 Yield Generation & Unlocking
- **Passive Base Yields**: From Flow staking rewards, distributed pro-rata
- **Locked by Default**: Yields build up but require correct challenge or vesting period to unlock
- **Post-Unlock Options**: Claim to wallet or compound to principal—all fee-free
- **Bonus Yields**: Funded sustainably from protocol reserves

## Flow Official Staking Protocol Integration

Tunnel leverages Flow's native staking infrastructure for secure, audited yield generation without custom contract complexity.

### How Flow Staking Works

```
+-------------------+       +-------------------+       +-------------------+
|   User Deposits   |       | Register Delegator|       | Delegate to Node  |
|   FLOW Tokens     | ----> | (Setup Collection)| ----> | Operator (Stake)  |
+-------------------+       +-------------------+       +-------------------+
           |                            |                        |
           v                            v                        v
+-------------------+       +-------------------+       +-------------------+
| Current Epoch     |       | Network Processes |       | Epoch End:        |
| Begins (7 Days)   | <---- | Transactions      | ----> | Calculate Rewards |
+-------------------+       +-------------------+       +-------------------+
           |                            |                        |
           | (Loop per Epoch)           | (Validate/Secure)       |
           |                            v                        v
           |                  +-------------------+       +-------------------+
           |                  | Claim Rewards?   | ----> | Withdraw Rewards  |
           |                  | (92% to User)    |       | to Wallet         |
           |                  +-------------------+       +-------------------+
           |                            |
           |                            v
           |                  +-------------------+       +-------------------+
           +----------------- | Unstake Request?  | ----> | Wait 1-2 Epochs   |
                              | (If Withdrawing)  |       | Then Withdraw     |
                              +-------------------+       +-------------------+
                                                                     |
                                                                     v
                                                          +-------------------+
                                                          | Tokens Returned   |
                                                          | to User Wallet    |
                                                          +-------------------+ 
```

#### Key Elements Explained
* **User Deposits FLOW**: Start by funding your wallet and preparing to stake
* **Register Delegator**: One-time setup using FlowStakingCollection to create your staking resource
* **Delegate to Node**: Choose a node ID and lock FLOW (min ~50 FLOW)
* **Epoch Cycle**: Network runs for ~7 days; your stake helps secure it
* **Rewards Calculation**: At epoch end, rewards are accrued (4-8% APR, 8% node fee)
* **Claim Rewards**: Withdraw to your wallet or compound (restake)
* **Unstake**: Request to unlock; wait for epoch delays before full withdrawal

### Integration Benefits

- **Simpler & Cheaper**: No custom contract deployment; leverage audited core protocols
- **Secure & Compliant**: Built-in slashing/rewards ensure network alignment
- **Faster Development**: Use pre-built transaction templates from Flow's GitHub
- **Scalable**: Handles pooling/delegation natively, perfect for no-loss yields

### Key Smart Contracts
- **FlowStakingCollection**: Main user-facing contract for delegation and reward management
- **FlowIDTableStaking**: Handles network's Identity Table and node registration

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15.5.3 with TypeScript
- **Styling**: Tailwind CSS v4
- **Blockchain Integration**: Flow Client Library (FCL) for wallet connections
- **Build Tools**: Turbopack for fast development

### Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with Navbar
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   └── components/
│       └── ui/
│           └── Navbar.tsx  # Navigation component
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Getting Started

### Prerequisites
- Node.js 20+ 
- Flow wallet (Blocto, Lilico, etc.)
- Minimum 50 FLOW tokens for staking

### Development Setup

1. **Clone and install dependencies**:
```bash
cd frontend
npm install
```

2. **Run development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## User Flow Example

1. **Connect Wallet** → Link your Flow wallet to the platform
2. **Stake FLOW** → Delegate tokens to selected node operators
3. **Daily Challenges** → Use generated credit points for knowledge quizzes  
4. **Win Rewards** → Correct answers unlock yields + bonus multipliers
5. **Claim/Compound** → Withdraw to wallet or increase stake share
6. **Track Progress** → Monitor leaderboards, streaks, and accuracy stats

## Roadmap

- [ ] FCL wallet integration and staking interface
- [ ] Challenge creation and resolution system  
- [ ] Leaderboards and gamification features
- [ ] Mobile-responsive design optimization
- [ ] Advanced analytics dashboard
- [ ] Multi-token support expansion

## Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests to help improve Tunnel.

## License

This project is licensed under the MIT License.