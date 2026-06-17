import sequelizeConfig from '../config/dbConfig.js'
import { Sequelize, DataTypes, DatabaseError, DATE } from 'sequelize'



const CronJobAudit = sequelizeConfig.define('CronJobAudit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDv4,
        primaryKey: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    schema: 'rforge',
    tableName: 'cron_job_audit',
    timestamps: false
}, {
    hooks: {
        afterCreate: async (record, options) => {
            const query = `
        DELETE FROM cron_job_audit
        WHERE id NOT IN (
          SELECT id 
          FROM cron_job_audit 
          ORDER BY "created_at" DESC, id DESC 
          LIMIT 10
        );
      `;

            // Pass the transaction to keep operations atomic
            await record.sequelize.query(query, {
                transaction: options.transaction,
                type: QueryTypes.DELETE
            });
        }
    }
}
)


export default CronJobAudit