import { SuiWalletConnectButton } from '@/Components';
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'

import * as styles from './DashboardPresentation.styles'
import { cx, css } from '@emotion/css';


const DashboardPresentation = () => {
	const sectionA = document.getElementById('sectionA');
	const sectionB = document.getElementById('sectionB');

	window.addEventListener('wheel', (e) => {
		if (e.deltaY < 0 && sectionA) {
			sectionA.scrollIntoView({ behavior: "smooth", block: "start" });
		} else if (e.deltaY > 0 && sectionB) {
			sectionB.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	});

	return (
		<>
			<div className={styles.sectionA} id="sectionA">
				<Image.LogoText className={styles.logo} />
				<SuiWalletConnectButton />
			</div>
			<div className={styles.sectionB} id="sectionB">
				<div className={styles.sectionBContent}>
					<div className={styles.sectionContent}>
						<div
							className={cx(
								styles.contentBlock,
								styles.twinsContent,
								css({
									alignItems: 'end',
								})
							)}
						>
							<div className={styles.titleBlock}>
								<span className={styles.sloganTitle}>What is SuiDouBashi ?</span>
								<Icon.LogoIcon />
							</div>
							<span className={styles.contentText}>
								SuiDouBashi, a cutting-edge DeFi ecosystem that seamlessly blends Automated Market Making (AMM),
								Vesting, and Voting features.Whether you're a small or large player, SuiDouBashi offers liquidity,
								growth, and a delightful DeFi experience.
							</span>
						</div>
						<div className={styles.contentBlock}>
							<span className={styles.sloganTitle}>Features</span>
							<div className={styles.block}>
								<span className={styles.contentTitle}>Vesting</span>
								<span className={styles.contentText}>
									SuiDouBashi's Vesting allows players to lockup SDB Coin in exchange for Bonding NFT
								</span>
							</div>
							<div className={styles.block}>
								<span className={styles.contentTitle}>AMM Dex</span>
								<span className={styles.contentText}>
									SuiDouBashi's AMM provides automated market maker functionality,
									ensuring liquidity for users to trade tokens with lower fees and deep slippage
								</span>
							</div>
							<div className={styles.block}>
								<span className={styles.contentTitle}>Voting</span>
								<span className={styles.contentText}>
									SuiDouBashi enables NFT holders to vote and participate in governance.
									The voting feature is seamlessly integrated into the AMM model,
									allowing SDB to gain value from external bribes and pool fees.
								</span>
							</div>
							<div className={styles.block}>
								<span className={styles.contentTitle}>Gaming mechanism</span>
								<span className={styles.contentText}>
									SuiDouBashi introduce Gaming features like levels and experience points as a loyalty program.
									Users can earn experience points through weekly voting and swap transactions
								</span>
							</div>
						</div>
						<div className={styles.contentBlock}>
							<span className={styles.sloganTitle}>What is SDB & VeSDB ?</span>
							<div className={styles.block}>
								<div className={styles.contentTitle}>
									SDB
								</div>
								<div className={styles.contentText}>
									SDB is used for rewarding liquidity providers through weekly emissions provided by SuiDouBashi. Any SDB holders can obtain NFT by vesting SDB.
								</div>
							</div>
							<div className={styles.block}>
								<div className={styles.contentTitle}>
									VeSDB
								</div>
								<div className={styles.contentText}>
									All VeSDB is stored in the form of NFT and used for governance. Any SDB holders can lock their tokens for up to 24 weeks to receive NFTs and gain access to the ecosystem and enjoy additional benefits
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
};

export default DashboardPresentation;
