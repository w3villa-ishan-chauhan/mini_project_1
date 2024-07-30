"""drop existing table and create new one

Revision ID: 3487b38c0dca
Revises: 6691d060de32
Create Date: 2024-07-25 14:59:18.918891

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3487b38c0dca'
down_revision: Union[str, None] = '6691d060de32'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
