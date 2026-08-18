import {
    hasKodyMarker,
    hasReviewMarker,
    isForceReviewCommand,
    isHeavyReviewCommand,
    isKodyMentionNonReview,
    isReviewCommand,
    parseReviewDirective,
} from '@libs/common/utils/codeManagement/codeCommentMarkers';

describe('codeCommentMarkers', () => {
    describe('isReviewCommand', () => {
        it('should return true for "@piku review"', () => {
            expect(isReviewCommand('@piku review')).toBe(true);
        });

        it('should return true for "@piku start-review"', () => {
            expect(isReviewCommand('@piku start-review')).toBe(true);
        });

        it('should return true with leading whitespace', () => {
            expect(isReviewCommand('  @piku review')).toBe(true);
            expect(isReviewCommand('\t@piku start-review')).toBe(true);
        });

        it('should return true case-insensitive', () => {
            expect(isReviewCommand('@KODY REVIEW')).toBe(true);
            expect(isReviewCommand('@Piku Start-Review')).toBe(true);
        });

        it('should return true with text after command', () => {
            expect(isReviewCommand('@piku review please')).toBe(true);
            expect(isReviewCommand('@piku start-review now')).toBe(true);
        });

        it('should return false for partial matches like "reviewing"', () => {
            expect(isReviewCommand('@piku reviewing')).toBe(false);
        });

        it('should return false for other @piku commands', () => {
            expect(isReviewCommand('@piku help')).toBe(false);
            expect(isReviewCommand('@piku explain')).toBe(false);
            expect(isReviewCommand('@piku what is this?')).toBe(false);
        });

        it('should return false when @piku is not at the start', () => {
            expect(isReviewCommand('hey @piku review')).toBe(false);
            expect(isReviewCommand('please @piku start-review')).toBe(false);
        });

        it('should return false for null/undefined', () => {
            expect(isReviewCommand(null)).toBe(false);
            expect(isReviewCommand(undefined)).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(isReviewCommand('')).toBe(false);
        });
    });

    describe('hasReviewMarker', () => {
        it('should return true for standard kody-codereview marker', () => {
            expect(hasReviewMarker('<!-- kody-codereview -->')).toBe(true);
        });

        it('should return true with varying whitespace', () => {
            expect(hasReviewMarker('<!--kody-codereview-->')).toBe(true);
            expect(hasReviewMarker('<!--  kody-codereview  -->')).toBe(true);
        });

        it('should return true when marker is embedded in text', () => {
            expect(
                hasReviewMarker('Some text <!-- kody-codereview --> more text'),
            ).toBe(true);
        });

        it('should return true case-insensitive', () => {
            expect(hasReviewMarker('<!-- KODY-CODEREVIEW -->')).toBe(true);
            expect(hasReviewMarker('<!-- Piku-CodeReview -->')).toBe(true);
        });

        it('should return false when marker is not present', () => {
            expect(hasReviewMarker('no marker here')).toBe(false);
            expect(hasReviewMarker('<!-- other-marker -->')).toBe(false);
        });

        it('should return false for null/undefined', () => {
            expect(hasReviewMarker(null)).toBe(false);
            expect(hasReviewMarker(undefined)).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(hasReviewMarker('')).toBe(false);
        });
    });

    describe('isKodyMentionNonReview', () => {
        it('should return true for @piku with other commands', () => {
            expect(isKodyMentionNonReview('@piku help')).toBe(true);
            expect(isKodyMentionNonReview('@piku explain this')).toBe(true);
            expect(isKodyMentionNonReview('@piku what is this?')).toBe(true);
        });

        it('should return true with leading whitespace', () => {
            expect(isKodyMentionNonReview('  @piku help')).toBe(true);
        });

        it('should return false for review commands', () => {
            expect(isKodyMentionNonReview('@piku review')).toBe(false);
            expect(isKodyMentionNonReview('@piku start-review')).toBe(false);
        });

        it('should return false for review commands case-insensitive', () => {
            expect(isKodyMentionNonReview('@piku REVIEW')).toBe(false);
            expect(isKodyMentionNonReview('@KODY start-review')).toBe(false);
        });

        it('should return false when @piku is not at the start', () => {
            expect(isKodyMentionNonReview('hey @piku help')).toBe(false);
        });

        it('should return false for null/undefined', () => {
            expect(isKodyMentionNonReview(null)).toBe(false);
            expect(isKodyMentionNonReview(undefined)).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(isKodyMentionNonReview('')).toBe(false);
        });

        it('should return true for @piku alone (just mention)', () => {
            expect(isKodyMentionNonReview('@piku')).toBe(true);
        });
    });

    describe('hasKodyMarker', () => {
        it('should return true for Code Review Completed marker', () => {
            expect(hasKodyMarker('## Code Review Completed! 🔥')).toBe(true);
        });

        it('should return true for critical issue marker', () => {
            expect(
                hasKodyMarker('# Found critical issues please fix them'),
            ).toBe(true);
        });

        it('should return true for @piku start patterns', () => {
            expect(hasKodyMarker('@piku start')).toBe(true);
            expect(hasKodyMarker('@piku start-review')).toBe(true);
        });

        it('should return true for @piku review pattern', () => {
            expect(hasKodyMarker('@piku review')).toBe(true);
        });

        it('should return true for kody without @ prefix', () => {
            expect(hasKodyMarker('kody start')).toBe(true);
            expect(hasKodyMarker('kody review')).toBe(true);
        });

        it('should return true for start-review alone', () => {
            expect(hasKodyMarker('start-review')).toBe(true);
        });

        it('should return false for regular comments', () => {
            expect(hasKodyMarker('This is a regular comment')).toBe(false);
            expect(hasKodyMarker('Please fix this bug')).toBe(false);
        });

        it('should return false for null/undefined', () => {
            expect(hasKodyMarker(null)).toBe(false);
            expect(hasKodyMarker(undefined)).toBe(false);
        });
    });

    describe('isForceReviewCommand', () => {
        it('should return true for "@piku review --force"', () => {
            expect(isForceReviewCommand('@piku review --force')).toBe(true);
        });

        it('should return true for "@piku start-review --force"', () => {
            expect(isForceReviewCommand('@piku start-review --force')).toBe(
                true,
            );
        });

        it('should accept single-dash and trailing text', () => {
            expect(isForceReviewCommand('@piku review -force')).toBe(true);
            expect(
                isForceReviewCommand('@piku review --force please retry'),
            ).toBe(true);
        });

        it('should be case-insensitive', () => {
            expect(isForceReviewCommand('@KODY REVIEW --FORCE')).toBe(true);
        });

        it('should return false for plain review commands', () => {
            expect(isForceReviewCommand('@piku review')).toBe(false);
            expect(isForceReviewCommand('@piku start-review')).toBe(false);
        });

        it('should not match "force" embedded mid-word', () => {
            expect(isForceReviewCommand('@piku review --forced')).toBe(false);
        });

        it('should return false for null/undefined/empty', () => {
            expect(isForceReviewCommand(null)).toBe(false);
            expect(isForceReviewCommand(undefined)).toBe(false);
            expect(isForceReviewCommand('')).toBe(false);
        });

        it('isReviewCommand should still match when --force is present', () => {
            // Force is a *flag on top of* a review command; both helpers
            // must agree so the handler still routes it as a review.
            expect(isReviewCommand('@piku review --force')).toBe(true);
            expect(isReviewCommand('@piku start-review --force')).toBe(true);
        });
    });

    describe('isHeavyReviewCommand', () => {
        it('matches --heavy in any position', () => {
            expect(isHeavyReviewCommand('@piku review --heavy')).toBe(true);
            expect(isHeavyReviewCommand('@piku review auth --heavy')).toBe(true);
            expect(
                isHeavyReviewCommand('@piku review --heavy --force'),
            ).toBe(true);
        });

        it('does NOT match a bare `heavy` (dash required, like --force)', () => {
            expect(isHeavyReviewCommand('@piku review heavy')).toBe(false);
            expect(
                isHeavyReviewCommand('@piku review heavy checkout path'),
            ).toBe(false);
        });
    });

    describe('parseReviewDirective', () => {
        it('returns the focus text for a plain directive', () => {
            expect(parseReviewDirective('@piku review auth logic')).toBe(
                'auth logic',
            );
        });

        it('returns undefined when there is no directive', () => {
            expect(parseReviewDirective('@piku review')).toBeUndefined();
            expect(parseReviewDirective('@piku review --force')).toBeUndefined();
            expect(parseReviewDirective('@piku review --heavy')).toBeUndefined();
        });

        it('strips flags whatever their position (leading, trailing, multiple)', () => {
            expect(parseReviewDirective('@piku review --heavy auth')).toBe(
                'auth',
            );
            expect(parseReviewDirective('@piku review auth --heavy')).toBe(
                'auth',
            );
            expect(
                parseReviewDirective('@piku review auth --heavy --force'),
            ).toBe('auth');
            expect(
                parseReviewDirective('@piku review --force auth --heavy'),
            ).toBe('auth');
        });

        it('does not strip focus words that merely contain heavy/force', () => {
            expect(
                parseReviewDirective('@piku review the forced retries path'),
            ).toBe('the forced retries path');
        });
    });

    describe('integration: command detection consistency', () => {
        it('should correctly identify review commands vs mentions', () => {
            const reviewCommands = [
                '@piku review',
                '@piku start-review',
                '  @piku review',
                '@KODY REVIEW',
            ];

            const nonReviewMentions = [
                '@piku help',
                '@piku explain',
                '@piku what is this code doing?',
                '@piku',
            ];

            reviewCommands.forEach((cmd) => {
                expect(isReviewCommand(cmd)).toBe(true);
                expect(isKodyMentionNonReview(cmd)).toBe(false);
            });

            nonReviewMentions.forEach((mention) => {
                expect(isReviewCommand(mention)).toBe(false);
                expect(isKodyMentionNonReview(mention)).toBe(true);
            });
        });

        it('should handle edge cases consistently', () => {
            // "reviewing" should not match as review command
            expect(isReviewCommand('@piku reviewing')).toBe(false);
            expect(isKodyMentionNonReview('@piku reviewing')).toBe(true);

            // "review-something" should not match as review command
            expect(isReviewCommand('@piku review-code')).toBe(false);
            expect(isKodyMentionNonReview('@piku review-code')).toBe(true);
        });
    });
});
