import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore } from './stores/config-store'
import { CARD_SPACING } from '@/consts'
import Link from 'next/link'
import { Fragment } from 'react'
import { HomeDraggableLayer } from './home-draggable-layer'

export default function BeianCard() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const styles = cardStyles.beianCard
	const hiCardStyles = cardStyles.hiCard

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x + hiCardStyles.width / 2 - styles.width + 200
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y + hiCardStyles.height / 2 + CARD_SPACING + 180

	const beianList = (siteContent.beian || []).filter(item => item.text)

	if (beianList.length === 0) {
		return null
	}

	return (
		<HomeDraggableLayer cardKey='beianCard' x={x} y={y} width={styles.width} height={styles.height}>
			<Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='flex flex-col items-center justify-center gap-1 px-3 max-sm:static'>
				{beianList.map((item, index) => (
					<Fragment key={index}>
						{item.link ? (
							<Link
								href={item.link}
								target='_blank'
								rel='noopener noreferrer'
								className='text-secondary flex items-center gap-1 text-xs whitespace-nowrap transition-opacity hover:opacity-80'>
								{item.icon && <img src={item.icon} alt='' className='h-3.5 w-3.5' />}
								{item.text}
							</Link>
						) : (
							<span className='text-secondary flex items-center gap-1 text-xs whitespace-nowrap'>
								{item.icon && <img src={item.icon} alt='' className='h-3.5 w-3.5' />}
								{item.text}
							</span>
						)}
					</Fragment>
				))}
			</Card>
		</HomeDraggableLayer>
	)
}