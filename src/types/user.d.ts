export interface UserParams {
	_id: string;
  isGravatarEnabled: boolean;
	isEmailPublished: boolean;
	lang: string;
	status: number;
	admin: boolean;
	name: string;
	username: string;
	email: string;
	createdAt: string;
	imageUrlCached: string;
	readOnly?: boolean
	isInvitationEmailSended?: boolean
	isQuestionnaireEnabled?: boolean
	updatedAt?: string
	__v?: number
}
